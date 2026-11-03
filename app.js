const express = require("express");
const timeRouter = require("./routes/timeRoutes");
const userRouter = require("./routes/userRoutes");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();

// Initialize the temporary in-memory data.
global.user_id = null;
global.users = [];
global.tasks = [];

// Parse JSON request bodies before routes.
app.use(express.json());

// Existing time routes.
app.use("/api", timeRouter);

// User routes.
app.use("/api/users", userRouter);

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

module.exports = { app, server };