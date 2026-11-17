
function notFound(req, res) {
  res.status(404).json({
    message: `No route found for ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;
