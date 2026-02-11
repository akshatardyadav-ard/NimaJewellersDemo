const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads", folder));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, uuid() + ext);
    },
  });

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const isValid =
    allowed.test(file.mimetype) &&
    allowed.test(path.extname(file.originalname).toLowerCase());

  cb(isValid ? null : new Error("Invalid file type"), isValid);
};

exports.productUpload = multer({
  storage: storage("products"),
  fileFilter,
});

exports.bannerUpload = multer({
  storage: storage("banners"),
  fileFilter,
});
