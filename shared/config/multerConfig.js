const multer = require('multer');
const c = require('../util/constants.frontcodes');
const BusinessException = require('../exceptionHandler/BusinessException');

const storage = multer.memoryStorage();

const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        throw new BusinessException(c.CODE_PHOTOS_ONLY);
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
