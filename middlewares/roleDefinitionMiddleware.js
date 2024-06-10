const User = require('../models/userModel');
const jwt = require('jsonwebtoken')

// exports.roleDefinition = async (req, res, next) => {
//     try {
//         // authToken middleware'i zaten user bilgilerini eklemiş olacak
//         if (req.user) {
//             req.user.role = req.user.role || 'user';
//         } else {
//             req.user = { role: 'user' };
//         }
//         next();
//     } catch (err) {
//         req.user = { role: 'user' };
//         next();
//     }
// };
exports.roleDefinition = async (req, res, next) => {
    try {
        const token = req.cookies.cookieJWT;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    req.user = { role: 'user' }; // Hata varsa varsayılan rol 'user'
                } else {
                    req.user = decoded; // Token doğrulandıysa decoded bilgiyi kullan
                    req.user.role = req.user.role || 'user'; // Rol bilgisi yoksa varsayılan 'user'
                }
                next();
            });
        } else {
            req.user = { role: 'user' }; // Token yoksa varsayılan rol 'user'
            next();
        }
    } catch (err) {
        req.user = { role: 'user' }; // Genel hata durumunda varsayılan rol 'user'
        next();
    }
};

