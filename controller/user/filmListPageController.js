const Film = require('../../models/filmModel');
const News = require('../../models/newsModel');

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short' };
  return new Date(date).toLocaleString('en-US', options).replace(',', '');
};

exports.filmListPage = async (req, res, next) => {
  try {
    const roleControl = req.user.role;

    let tokenControl = false;
        if (req.cookies.cookieJWT) {
            tokenControl = true;
        }

    const perPage = parseInt(req.query.perPage) || 5; // Sayfa başına film sayısı, varsayılan 5
    const page = parseInt(req.query.page) || 1; // Mevcut sayfa numarası, varsayılan 1

    const totalFilms = await Film.countDocuments(); // Toplam film sayısını alır
    const films = await Film.find()
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      ;

    films.forEach(film => {
      film.formattedDate = formatDate(film.releaseDate);
    });

    res.render('user/filmListPage', {
      tokenControl,
      roleControl,
      films,
      totalFilms,
      current: page,
      pages: Math.ceil(totalFilms / perPage),
      perPage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchFilms = async (req, res, next) => {
  try {
    const roleControl = req.user.role;

    let tokenControl = false;
    if (req.cookies.cookieJWT) {
      tokenControl = true;
    }

    const perPage = parseInt(req.query.perPage) || 5; // Sayfa başına film sayısı, varsayılan 5
    const page = parseInt(req.query.page) || 1; // Mevcut sayfa numarası, varsayılan 1
    const searchQuery = req.query.search || ''; // Arama sorgusunu al
    const genres = Array.isArray(req.query.genres) ? req.query.genres : req.query.genres ? req.query.genres.split(',') : []; // Seçilen türleri al
    const ratingRange = req.query.ratingRange || ''; // Puan aralığını al

    let filter = {};
    if (searchQuery) {
      filter.title = { $regex: searchQuery, $options: 'i' };
    }
    if (genres.length > 0) {
      filter.genre = { $in: genres };
    }
    if (ratingRange) {
      const [minRating, maxRating] = ratingRange.split('-').map(Number);
      filter.rating = { $gte: minRating, $lte: maxRating };
    }

    const totalFilms = await Film.countDocuments(filter); // Toplam film sayısını alır
    const films = await Film.find(filter)
      .skip((perPage * page) - perPage)
      .limit(perPage);

    films.forEach(film => {
      film.formattedDate = formatDate(film.releaseDate);
    });

    res.render('user/filmListPage', {
      tokenControl,
      roleControl,
      films,
      totalFilms,
      current: page,
      pages: Math.ceil(totalFilms / perPage),
      perPage,
      searchQuery,
      genres,
      ratingRange
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};