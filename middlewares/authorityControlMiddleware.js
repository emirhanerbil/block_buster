const User = require('../models/userModel');
const jwt = require('jsonwebtoken')

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send("Access denied");
    }
};