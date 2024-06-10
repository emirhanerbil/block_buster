const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const Film = require('../models/filmModel'); // Film modelinizi import edin
const News = require('../models/newsModel'); // News modelinizi import edin

let sitemap;

const generateSitemap = async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (sitemap) {
    res.send(sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({ hostname: 'http://localhost:3000/' });
    const pipeline = smStream.pipe(createGzip());

    // Statik URL'leri ekleyin
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/home', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/films/list', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/news/list', changefreq: 'weekly', priority: 0.8 });

    // Dinamik URL'leri çek ve ekle
    const filmUrls = await Film.find({}, 'slug').exec();
    const newsUrls = await News.find({}, 'slug').exec();

    filmUrls.forEach(film => {
      smStream.write({ url: `/film/detail/${film.slug}`, changefreq: 'weekly', priority: 0.8 });
    });

    newsUrls.forEach(news => {
      smStream.write({ url: `/news/detail/${news.slug}`, changefreq: 'weekly', priority: 0.8 });
    });

    smStream.end();

    streamToPromise(pipeline).then(sm => sitemap = sm);
    pipeline.pipe(res).on('error', (e) => { throw e; });

  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

module.exports = generateSitemap;