const Film = require('../../models/filmModel');
const News = require('../../models/newsModel');

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit' };
  return new Date(date).toLocaleString('en-US', options).replace(',', '');
};

exports.newsListPage = async (req, res, next) => {
  try {
    const roleControl = req.user.role

    let tokenControl = false;
        if (req.cookies.cookieJWT) {
            tokenControl = true;
        }

    const perPage = parseInt(req.query.perPage) || 5; // Sayfa başına duyuru sayısı, varsayılan 5
    const page = parseInt(req.query.page) || 1; // Mevcut sayfa numarası, varsayılan 1

    const totalNews = await News.countDocuments(); // Toplam duyuru sayısını alır
    const newsList = await News.find()
      .sort({ createdAt: -1 }) // Haberleri son eklenenden sıralar
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();
      
    newsList.forEach(news => {
      news.formattedDate = formatDate(news.createdAt);
    });

    const latestNews = await News.find().sort({ createdAt: -1 }).limit(3);
    const allTags = await News.distinct('tags');

    res.render('user/newsListPage', {
      tokenControl,
      roleControl,
      news: newsList,
      allTags,
      latestNews,
      current: page,
      pages: Math.ceil(totalNews / perPage),
      perPage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchNews = async (req, res, next) => {
  try {
    const roleControl = req.user.role;

    let tokenControl = false;
    if (req.cookies.cookieJWT) {
      tokenControl = true;
    }

    const perPage = parseInt(req.query.perPage) || 5; // Sayfa başına duyuru sayısı, varsayılan 5
    const page = parseInt(req.query.page) || 1; // Mevcut sayfa numarası, varsayılan 1
    const searchQuery = req.query.search || ''; // Arama sorgusunu al

    let filter = {};
    if (searchQuery) {
      filter = { title: { $regex: searchQuery, $options: 'i' } }; // Duyuru başlığında arama yap
    }

    const totalNews = await News.countDocuments(filter); // Toplam duyuru sayısını alır
    const newsList = await News.find(filter)
      .sort({ createdAt: -1 }) // Haberleri son eklenenden sıralar
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();

    newsList.forEach(news => {
      news.formattedDate = formatDate(news.createdAt);
    });

    const latestNews = await News.find().sort({ createdAt: -1 }).limit(3);
    const allTags = await News.distinct('tags');

    res.render('user/newsListPage', {
      tokenControl,
      roleControl,
      news: newsList,
      allTags,
      latestNews,
      current: page,
      pages: Math.ceil(totalNews / perPage),
      perPage,
      searchQuery // Arama sorgusunu geri gönder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.newsByCategory = async (req, res, next) => {
  try {
    const roleControl = req.user.role;

    let tokenControl = false;
    if (req.cookies.cookieJWT) {
      tokenControl = true;
    }

    const perPage = parseInt(req.query.perPage) || 5; // Sayfa başına duyuru sayısı, varsayılan 5
    const page = parseInt(req.query.page) || 1; // Mevcut sayfa numarası, varsayılan 1
    const category = req.params.category; // Kategori ismini URL'den al

    const filter = { tags: category }; // Kategoriye göre filtreleme yap

    const totalNews = await News.countDocuments(filter); // Toplam duyuru sayısını alır
    const newsList = await News.find(filter)
      .sort({ createdAt: -1 }) // Haberleri son eklenenden sıralar
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec();

    newsList.forEach(news => {
      news.formattedDate = formatDate(news.createdAt);
    });

    const latestNews = await News.find().sort({ createdAt: -1 }).limit(3);
    const allTags = await News.distinct('tags');

    res.render('user/newsListPage', {
      tokenControl,
      roleControl,
      news: newsList,
      allTags,
      latestNews,
      current: page,
      pages: Math.ceil(totalNews / perPage),
      perPage,
      category // Kategori ismini geri gönder
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};