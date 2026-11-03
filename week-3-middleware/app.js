const express = require("express");
const path = require("path");
const crypto = require("crypto");
const dogRouter = require("./routes/dogs");

const app = express();

// Add a unique request ID to every request.
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

// Log each request with its ID.
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}]: ${req.method} ${req.path} (${req.requestId})`
  );
  next();
});

// Parse JSON request bodies.
app.use(express.json());

// Serve files from the public directory.
app.use(express.static(path.join(__dirname, "public")));

// Register the dog routes.
app.use("/", dogRouter);

// Handle requests that do not match a route.
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.requestId,
  });
});

// Handle unexpected errors.
app.use((err, req, res, next) => {
  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.requestId,
  });
});

module.exports = app;
