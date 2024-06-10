const UserVisit = require('../../models/userVisitModel');


module.exports.getTotalVisits = async (req, res) => {
  const totalVisits = await UserVisit.countDocuments();
  res.json({ totalVisits });
};

module.exports.getOnlineUsers = (req, res) => {
  res.json({ onlineUsers });
};