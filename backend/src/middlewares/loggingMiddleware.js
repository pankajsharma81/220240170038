const { log } = require('../utils/logClient');

function loggingMiddleware(req, res, next) {
  try {
    const path = req.originalUrl;
    const method = req.method;
    log('backend', 'info', 'middleware', `incoming ${method} ${path}`);
  } catch (_) {}
  next();
}

module.exports = loggingMiddleware;
