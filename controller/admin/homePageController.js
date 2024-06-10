const Film = require('../../models/filmModel');
const News = require('../../models/newsModel');
const User = require('../../models/userModel');

exports.homePage = async (req, res, next) => {
    try {
        
        const films = await Film.find();
        const news = await News.find();
        const users = await User.find();
        const totalUsers = await User.countDocuments();
        const totalFilms = await Film.countDocuments();
        res.render('admin/homePage', {
            films,
            news,
            users,
            user: req.user,
            totalUsers,
            totalFilms
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}