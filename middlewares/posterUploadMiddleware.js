const fs = require("fs");
const multer = require("multer")
const { v4: uuidv4 } = require('uuid');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads")
    },
    filename:function(req,file,cb){
        const uniqName = uuidv4();
        cb(null,file.fieldname+uniqName+file.originalname)
    }
})
const fileFilter =(req,file,cb)=>{
    cb(null,true);
}
const upload =multer({storage:storage,fileFilter:fileFilter}).array("files",5);

const uploadFiles = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        reject(new Error('Dosya yükleme hatası: ' + err.message));
      } else {
        console.log(req.posters)
        resolve(req.files);
      }
    });
  });
};

module.exports = {
  uploadFiles
};
