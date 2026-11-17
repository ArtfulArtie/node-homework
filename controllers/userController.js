
const crypto = require("crypto");
const util = require("util");
const prisma = require("../db/prisma");
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

async function register(req, res, next) {
  if (!req.body) req.body = {};

  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { name, password } = value;
  const email = value.email.toLowerCase();
  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
      select: {
        name: true,
        email: true,
        id: true,
      },
    });

    global.user_id = user.id;

    return res.status(201).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (
      err.name === "PrismaClientKnownRequestError" &&
      err.code === "P2002"
    ) {
      return res.status(400).json({ message: "User already exists" });
    }

    return next(err);
  }
}

async function logon(req, res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    const goodCredentials =
      user && (await comparePassword(password, user.hashedPassword));

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
  } catch (err) {
    return next(err);
  }
}

function logoff(req, res) {
  global.user_id = null;

  return res.sendStatus(200);
}

module.exports = { register, logon, logoff };
