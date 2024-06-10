const Film = require('../../models/filmModel');
const News = require('../../models/newsModel');
const { getYouTubeThumbnails }= require('../../middlewares/youtubeApi')

const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(date).toLocaleString('en-US', options).replace(',', '');
  };

  exports.homePage = async (req, res, next) => {
    try {
        const roleControl = req.user.role;
        console.log(roleControl)
        let tokenControl = false;

        if (req.cookies.cookieJWT) {
            tokenControl = true;
        }

        const films = await Film.find();
        const filmsWithDetails = await getYouTubeThumbnails(films);
        const filmsInTheaters = filmsWithDetails.filter(film => film.isInTheaters);
        const topRatedFilms = filmsWithDetails.sort((a, b) => b.rating - a.rating).slice(0, 2);
        const latestNews = await News.find().sort({ createdAt: -1 }).limit(4);
        latestNews.forEach(news => {
            news.formattedDate = formatDate(news.createdAt);
        });
        const news = await News.find();

        res.render('user/homePage', {
            tokenControl,
            roleControl,
            topRatedFilms,
            filmsInTheaters,
            films: filmsWithDetails,
            news,
            latestNews,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

