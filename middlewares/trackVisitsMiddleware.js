const UserVisit = require('../models/userVisitModel');

const trackVisits = async (req, res, next) => {
  if (req.path.startsWith('/user')) { // Admin sayfası ziyaretlerini izleme
    const ip = req.ip;
    const existingVisit = await UserVisit.findOne({ ip: ip });
    if (!existingVisit) {
      const userVisit = new UserVisit({ ip: ip });
      await userVisit.save();
    }
  }
  next();
};


module.exports = trackVisits;