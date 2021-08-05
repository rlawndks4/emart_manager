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
const upload = multer({storage: storage})

module.exports = {upload}