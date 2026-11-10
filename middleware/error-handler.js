
function errorHandler(err, req, res, next) {
  if (err.code === "ECONNREFUSED") {
    console.error(
      "Database connection refused. Is the database service running?"
    );
  }

  res.status(500).json({
    error: "Internal Server Error",
  });
}

module.exports = errorHandler;
