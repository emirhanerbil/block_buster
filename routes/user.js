const express = require('express');
const homePageController = require('../controller/user/homePageController');
const filmListPageController = require('../controller/user/filmListPageController')
const newsListPageController = require('../controller/user/newsListPageController')
const newsDetailPageController = require('../controller/user/newsDetailPageController')
const filmDetailPageController = require('../controller/user/filmDetailPageController')
const {roleDefinition} = require('../middlewares/roleDefinitionMiddleware')
const {authToken} = require('../middlewares/authTokenMiddleware')

router = express.Router();

router.use(roleDefinition)


router.get('/',homePageController.homePage);
router.get('/home',homePageController.homePage);
router.get('/films/list',filmListPageController.filmListPage);
router.get('/news/list',newsListPageController.newsListPage);
router.get('/news/detail/:slug',newsDetailPageController.newsDetailPage);
router.get('/film/detail/:slug',filmDetailPageController.filmDetailPage)
router.get('/news/search', newsListPageController.searchNews); // Yeni arama rotasını ekleyin
router.get('/news/category/:category', newsListPageController.newsByCategory); // Yeni kategori rotasını ekleyin
router.get('/films/search', filmListPageController.searchFilms); // Yeni film arama rotasını ekleyin

module.exports = router;