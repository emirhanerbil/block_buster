const Film = require('../../models/filmModel');
const News = require('../../models/newsModel');


const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit' };
    return new Date(date).toLocaleString('en-US', options).replace(',', '');
  };


exports.newsDetailPage = async (req, res, next) => {
    try{
        const { slug } = req.params;
        const roleControl = req.user.role

        let tokenControl = false;
        if (req.cookies.cookieJWT) {
            tokenControl = true;
        }

        const newsId = req.params.id;
        const news = await News.findOne({ slug }); // Veritabanından haber verisini alın
        if (!news) {
            return res.status(404).json({ message: 'Duyuru bulunamadı' });
        }

        if (news.slug !== slug) {
            return res.redirect(`/news/detail/${id}/${news.slug}`);
          }

        news.formattedDate = formatDate(news.createdAt)
        res.render('user/newsDetailPage',{
            tokenControl,
            roleControl,
            news
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message }); 
    }

}