const mongoose = require('mongoose');

const userVisitSchema = new mongoose.Schema({
  ip: { type: String, unique: true },
  visitedAt: { type: Date, default: Date.now }
});

const UserVisit = mongoose.model('UserVisit', userVisitSchema);

module.exports = UserVisit;