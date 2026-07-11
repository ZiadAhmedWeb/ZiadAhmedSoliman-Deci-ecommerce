const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  method: String,
  route: String,
  statusCode: Number,
  userId: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);