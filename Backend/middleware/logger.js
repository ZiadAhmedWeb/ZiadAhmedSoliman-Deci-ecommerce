const Log = require('../models/Log');

function logRequest(req, res, next) {
  res.on('finish', () => {
    Log.create({
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      userId: req.user?.userId || null,
    }).catch((err) => console.error('Log save error:', err));
  });
  next();
}

module.exports = logRequest;