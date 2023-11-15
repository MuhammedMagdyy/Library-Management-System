import multer, { MulterError } from 'multer';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const multerOptions = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      cb(null, true);
    } else {
      const multerError = new MulterError('LIMIT_UNEXPECTED_FILE');
      cb(multerError);
    }
  },
});
