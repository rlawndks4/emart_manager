const fs = require('fs')
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const db = require('./config/db')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https')
const port = 8001;
app.use(cors());
app.use(express.json());
const jwt = require('jsonwebtoken')


const multer = require('multer');

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
                cb(null, 'image/ad/')
        },
        filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname)
        }
})
const upload = multer({storage: storage})
app.use(bodyParser.urlencoded({
        extended: true
}));

const path = require('path');
app.set('/routes', __dirname + '/routes');
app.use('/config', express.static(__dirname + '/config'));


app.use(cookieParser());
app.use('/api', require('./routes/api'))
app.get('/', (req, res) => {
        console.log("back-end initialized")
        res.send('back-end initialized')
});


app.use('/image', express.static('./upload'));

app.post('/api/addad', upload.single('image'),(req, res) =>{
        console.log(req.body)
        console.log(req.file)
        const sql = 'INSERT INTO ad_information_tb  (ad_name, ad_image) VALUE (? , ?)'
        const adName = req.body.adName;
        const image = "/image/ad/" + req.file.filename;
        db.query(sql, [adName, image] , (err, rows, feild)=>{
                if(err) console.log(err)
                else{
                        res.send(rows);
                }
        })
})

app.listen(port, () => {
        console.log("Server running on port 8001")
})