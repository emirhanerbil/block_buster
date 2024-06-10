const User = require('../models/userModel');
const jwt = require('jsonwebtoken')

exports.authToken = async (req, res, next) => {
    try {
        const token = req.cookies.cookieJWT;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    console.log(err.message);
                    // res.redirect("/auth/login");
                } else {
                    const user = await User.findById(decoded.userId);
                    if (!user) {
                        // res.redirect("/auth/login");
                    } else {
                        req.user = user;
                        next();
                    }
                }
            });
        } else {
            res.redirect("/auth/login");
        }
    } catch (error) {
        res.json({
            succeeded: false,
            error: "Not authorized"
        });
    }
};