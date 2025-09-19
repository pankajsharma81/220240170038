// Custom logging middleware according to your pre-test setup
function loggingMiddleware(req, res, next) {
  // Example: replace with your actual LoggingMiddleware integration
  if (typeof window !== "undefined" && window.LoggingMiddleware) {
    window.LoggingMiddleware.log(`${req.method} ${req.originalUrl}`, req.body || {});
  } else {
    console.log(`${req.method} ${req.originalUrl}`); // fallback
  }
  next();
}

module.exports = loggingMiddleware;
