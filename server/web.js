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

require('dotenv').config()
//passport, jwt
const jwt = require('jsonwebtoken')
const { checkLevel, lowLevelException, logRequestResponse } = require('./util')
const passport = require('passport');
const passportConfig = require('./passport');

//multer
const {upload} = require('./config/multerConfig')

//express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

const path = require('path');
app.set('/routes', __dirname + '/routes');
app.use('/config', express.static(__dirname + '/config'));
//app.use('/image', express.static('./upload'));
app.use('/image', express.static('image'));
app.use('/api', require('./routes/api'))

app.get('/', (req, res) => {
        console.log("back-end initialized")
        res.send('back-end initialized')
});

app.post('/api/addad', upload.single('image'), (req, res) =>{
        if(checkLevel(req.cookies.token, 40))
        {
                const sql = 'INSERT INTO ad_information_tb  (ad_name, ad_image) VALUE (? , ?)'
                const adName = req.body.adName;
                const image = "/image/ad/" + req.file.filename;
                db.query(sql, [adName, image], (err, rows, feild)=>{
                        logRequestResponse(
                                req,
                                {
                                        query: sql,
                                        param: [adName, image],
                                        success: (err) ? false : true 
                                }
                        )
                        if(err) console.log(err)
                        else{
                                res.send(rows);
                        }
                })
        }
        else
        {
                res.send(lowLevelException)
        }
})

//상품 추가
app.post('/api/addproduct', upload.fields([{name : 'mainImage'}, {name : 'detailImage'}, {name : 'qrImage'}]), (req, res, next) => {
        if(checkLevel(req.cookies.token, 0))
        {
                // fk(1~5), int, string, int, bool(0,1)
                const {brandPk, itemNum, itemName, classification, middleClass, status} = req.body;
                const sql = 'INSERT INTO item_information_tb (brand_pk, item_num, item_name, classification, middle_class, main_image, detail_image, qr_image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
                const mainImage = "/image/item/" + req.files.mainImage[0].filename
                const detailImage = "/image/detailItem/" + req.files.detailImage[0].filename
                const qrImage = "/image/qr/" + req.files.qrImage[0].filename
                const param = [brandPk, itemNum, itemName, classification, middleClass, mainImage, detailImage, qrImage, status]
                // console.log(req.files)
                db.query(sql, param, (err, result) => {
                        logRequestResponse(
                                req,
                                {
                                        query: sql,
                                        param: param,
                                        success: (err) ? false : true 
                                }
                        )
                        if (err) {
                                console.log(err)
                        }
                        else {
                                console.log(result)
                                res.send(result)
                        }
                })      
        }
        else
                res.send(lowLevelException)
})

app.post('/api/images', upload.array('images'), (req, res, err) => {
        res.send({message: "파일 전송 완료"})
})
app.listen(port, '0.0.0.0', () => {
        console.log("Server running on port 8001")
})

