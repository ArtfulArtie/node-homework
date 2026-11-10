
const express = require("express");
const pool = require("./db/pg-pool");
const timeRouter = require("./routes/timeRoutes");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/auth");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();

// Initialize the current authenticated user.
global.user_id = null;

// Parse JSON request bodies before routes.
app.use(express.json());

// Database health check.
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      db: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      db: "disconnected",
      error: error.message,
    });
  }
});

// Existing time routes.
app.use("/api", timeRouter);

// Public user routes.
app.use("/api/users", userRouter);

// Protected task routes.
app.use("/api/tasks", authMiddleware, taskRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/testpost", (req, res) => {
  res.status(200).json({ message: "POST route works" });
});

// Keep not-found and error handling after the routes.
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

// Gracefully shut down the server and database connection pool.
let isShuttingDown = false;

async function shutdown(code = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("Shutting down server...");

  server.close(async (error) => {
    if (error) {
      console.error("Error closing server:", error);
      code = 1;
    }

    try {
      await pool.end();
      console.log("Database connection pool closed.");
    } catch (poolError) {
      console.error("Error closing database pool:", poolError);
      code = 1;
    }

    process.exit(code);
  });
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

module.exports = { app, server };
