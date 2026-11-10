
const crypto = require("crypto");
const util = require("util");
const pool = require("../db/pg-pool");
const { userSchema } = require("../validation/userSchema");

const scrypt = util.promisify(crypto.scrypt);

// Hash a password using a random salt.
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
}

// Compare a submitted password with a stored hash.
async function comparePassword(inputPassword, storedHash) {
  const [salt, storedKey] = storedHash.split(":");

  const derivedKey = await scrypt(inputPassword, salt, 64);
  const storedBuffer = Buffer.from(storedKey, "hex");

  return (
    derivedKey.length === storedBuffer.length &&
    crypto.timingSafeEqual(derivedKey, storedBuffer)
  );
}

async function register(req, res) {
  if (!req.body) req.body = {};

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { name, email, password } = value;
  const hashedPassword = await hashPassword(password);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, hashed_password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    global.user_id = user.id;

    return res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "User already exists" });
    }

    throw err;
  }
}

async function logon(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const result = await pool.query(
    "SELECT id, name, email, hashed_password FROM users WHERE email = $1",
    [email]
  );

  const user = result.rows[0];

  const goodCredentials =
    user && (await comparePassword(password, user.hashed_password));

  if (!goodCredentials) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  global.user_id = user.id;

  return res.status(200).json({
    name: user.name,
    email: user.email,
  });
}

function logoff(req, res) {
  global.user_id = null;

  return res.sendStatus(200);
}

module.exports = { register, logon, logoff };
