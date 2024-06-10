const News = require('../../models/newsModel');
const { uploadFiles,upload } = require('../../middlewares/posterUploadMiddleware');
const slugify = require('slugify');

const generateUniqueSlug = async (title) => {
    let slug = slugify(title, { lower: true, strict: true });
    let existingNews = await News.findOne({ slug });
    let counter = 1;
  
    while (existingNews) {
      slug = slugify(`${title}-${counter}`, { lower: true, strict: true });
      existingNews = await News.findOne({ slug });
      counter++;
    }
  
    return slug;
  };
  

exports.renderAddNewsPage = async(req,res,next)=>{
    res.render('admin/addNewsPage',{
        user: req.user,
    });
}

exports.addNews = async(req,res,next)=>{
    try{
        const files = await uploadFiles(req,res);
        const {title,content,tags} = req.body;

        const slug = await generateUniqueSlug(title);

        const images = files.map(file => ({
            path: file.path
          }));

          const tagsArray = tags.split('-');

        const data = new News({
            title,
            content,
            tags,
            images,
            tags:tagsArray,
            slug
        })

        const saveNews = await data.save();
        res.redirect('/admin/news/list')
    }
    catch(err){
        if (err.message.includes('Dosya yükleme hatası')) {
            return res.status(400).json({ message: err.message });
          }
          res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
}

exports.listNews = async (req, res, next) => {
    try {
        const news = await News.find(); 
        res.render('admin/listNewsPage',{
            user: req.user,
            news
        });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

exports.getUpdateNewsForm = async (req, res, next) => {
    try {
        const newsId = req.params.id; // URL'den haber ID'sini alın
        const news = await News.findById(newsId); // Veritabanından haber verisini alın
        if (!news) {
            return res.status(404).json({ message: 'Haber bulunamadı' });
        }
        res.render('admin/updateNewsPage',{
            user: req.user,
            news
        }); // Haber verisini JSON formatında döndürün
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

exports.updateNews = async (req, res, next) => {
    try {
        const files = await uploadFiles(req, res);
        const newsId = req.params.id; // URL'den film ID'sini alın
        const existingNews = await News.findById(newsId);
        const { title,content,tags } = req.body;

        const tagsArray = tags.split('-');

        // Güncelleme için yeni dosyaları yükleyin (isteğe bağlı)
        let images = [];
        if (files && files.length > 0) {
            images = files.map(file => ({
                path: file.path
            }));
        }

        else {
            // Yeni resim yüklenmemişse eski resimleri kullan
            images = existingNews.images;
        }

        // Film verilerini güncelleyin
        const updatedData = {
            title: title || existingNews.title,
            content: content || existingNews.content,
            tags: tagsArray || existingNews.tags,
            images:images
        };
        

        const updatedNews = await News.findByIdAndUpdate(newsId, updatedData, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: 'Haber bulunamadı' });
        }
        res.redirect('/admin/news/list') // Güncellenmiş haber verisini JSON formatında döndürün
    } catch (err) {
        if (err.message.includes('Dosya yükleme hatası')) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
};

exports.deleteNews = async (req, res, next) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) {
            return res.status(404).send('Haber bulunamadı veya zaten silinmiş');
        }
        res.redirect('/admin/news/list')
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası: ' + err.message });
    }
}