const Film = require('../../models/filmModel');
const News = require('../../models/newsModel');


const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleString('en-US', options).replace(',', '');
  };

exports.filmDetailPage = async (req, res, next) => {
    try{
        const { slug } = req.params;
        const roleControl = req.user.role;

        let tokenControl = false;
        if (req.cookies.cookieJWT) {
            tokenControl = true;
        }

        // const filmId = req.params.id;
        const film = await Film.findOne({ slug });
        const relatedFilms = await Film.find({ 
            genre: film.genre, 
            _id: { $ne: film._id } // Aynı filmi dahil etmemek için
          });
        if (!film) {
            return res.status(404).json({ message: 'Film Bulunamadı' });
        }
        if (film.slug !== slug) {
            return res.redirect(`/film/detail/${id}/${film.slug}`);
          }

        film.formattedDate = formatDate(film.releaseDate)
        relatedFilms.forEach(films => {
            films.formattedDate = formatDate(films.releaseDate);
          });
        res.render('user/filmDetailPage',{
            tokenControl,
            roleControl,
            film,
            relatedFilms
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message }); 
    }

}