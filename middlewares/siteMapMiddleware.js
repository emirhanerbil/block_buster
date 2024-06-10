// middlewares/sitemapMiddleware.js
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const fs = require('fs');
const path = require('path');

let sitemap;

const generateSitemap = async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (sitemap) {
    res.send(sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({ hostname: 'http://localhost:3000' });
    const pipeline = smStream.pipe(createGzip());

    // Add routes here
    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: 'user/home', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: 'user/films/list', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: 'user/news/list', changefreq: 'weekly', priority: 0.8 });
    // Add more URLs from your application

    smStream.end();

    streamToPromise(pipeline).then(sm => sitemap = sm);
    pipeline.pipe(res).on('error', (e) => { throw e; });

  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

module.exports = generateSitemap;
