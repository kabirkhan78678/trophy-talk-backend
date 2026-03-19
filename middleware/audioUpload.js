import multer from 'multer';
import path from 'path';
 
const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/audio/');
  },
  filename: (req, file, cb) => {
    // Extract original file extension
    const ext =path.extname(file.originalname)
    cb(null, `${file.fieldname}${Date.now()}${ext}`);
  }
});

const uploadAudio = multer({ storage: storageProduct });

export { uploadAudio };