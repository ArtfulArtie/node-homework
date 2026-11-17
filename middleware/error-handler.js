
function errorHandler(err, req, res, next) {
  if (err.code === "ECONNREFUSED") {
    console.error(
      "Database connection refused. Is the database service running?"
    );
  }

  if (err.name === "PrismaClientInitializationError") {
    console.error("Couldn't connect to the database. Is it running?");
  }

  res.status(500).json({
    error: "Internal Server Error",
  });
}

module.exports = errorHandler;
