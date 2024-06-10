const User = require("../../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginPage = (req, res, next) => {
    res.render('user/partials/login');
};

exports.registerPage = (req, res, next) => {
    // res.render('auth/register',{layout:false})
};

exports.register = async (req, res, next) => {
    try {
        const data = {
            email: req.body.email,
            userName: req.body.userName,
            password: req.body.password
        };

        // Kullanıcının önceden kayıtlı olup olmadığının kontrolü
        const existingUser = await User.findOne({ userName: data.userName });
        if (existingUser) {
            return res.status(400).json({ message: "Bu kullanıcı adı kullanılmaktadır. Lütfen başka kullanıcı adı giriniz." });
        }

        // Password hash
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        // Kullanıcı kaydet
        const userData = await User.create(data);

        // JWT oluştur ve çerez olarak ayarla
        const token = createToken(userData._id, userData.role);
        res.cookie("cookieJWT", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24
        });
        res.redirect('/user/home')
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const check = await User.findOne({ userName: req.body.userName });
        if (check) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (isPasswordMatch) {
                const token = createToken(check._id, check.role); // role bilgisini ekliyoruz
                res.cookie("cookieJWT", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24
                });
                res.redirect('/user/home')
            } else {
                res.send("Kullanıcı adı veya şifre hatalı");
            }
        } else {
            res.render('./user/login_404')
        }
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('cookieJWT');
    res.redirect('/user/home')
};

const createToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
