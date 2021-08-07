const multer = require('multer');

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
                if(file.fieldname === 'mainImage')
                        cb(null, 'image/item/')
                else if(file.fieldname === 'detailImage')
                        cb(null, 'image/detailItem/')
                else if(file.fieldname === 'qrImage')
                        cb(null, 'image/qr/')
                else
                        cb(null, 'image/ad/')
        },
        filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname)
        }
})
const fileFilter = (req, file, cb) => {
        let typeArray = file.mimetype.split('/')
        let filetype = typeArray[1]
        if(filetype == 'jpg' || filetype == 'png' || filetype == 'gif' || filetype == 'jpeg' || filetype == 'bmp' || filetype == 'mp4') 
                return cb(null, true)
        console.log("파일 확장자 오류: ", filetype)
        req.fileValidationError = "파일 형식이 올바르지 않습니다(.jpg, .png, .gif 만 가능)"
        cb(null, false, new Error("파일 형식이 올바르지 않습니다(.jpg, .png, .gif 만 가능)"))
}
const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limit: {fileSize : 100 * 1024 * 1024}
})

module.exports = {upload}