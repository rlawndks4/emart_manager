const express = require('express');
const router = express.Router();
const path = require('path')
const db = require('../config/db')
const cors = require('cors');
const { json } = require('body-parser');
const customerInterface = require('../interface/CustomerInterface')
router.use(cors());
router.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10
const multer = require('multer');


router.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});


//--------------------------------------------------------키오스크
//키오스크 리스트
router.get('/kiosk', (req, res) => {
    db.query('SELECT * FROM kiosk_information_tb', (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }

    })
})


//  router.post('/addkiosk', (req, res) => {
//      const kioskNum = req.body.kioskNum
//      const uniNum = req.body.uniNum
//      const store = req.body.store
//      const user_pk = 10
//     const kiosk_num = "#014123"
//      db.query('select * from kiosk_information_tb where kiosk_num=?', [kiosk_num], (err, result) =>{
//          if (!err)
//          {
//              if(customerInterface.KioskDivide(result, kiosk_num))
//              {
//                  db.query("update kiosk_information_tb set ",(err,result)=>{}) 


//              }
//              else
//              {
//                  db.query('INSERT INTO kiosk_information_tb (kiosk_num, store_name, unique_code) VALUES (?, ?, ?)',
//                  [kioskNum, store, uniNum], (err, result) => {
//                      if (err) {
//                          console.log(err)
//                      } else {
//                          response = {
//                              'code': res.statusCode,
//                             'message': res.statusMessage,
//                              'data': []
//                          }
//                          res.send(JSON.stringify(response))
//                      }
//                  })
//              }    
//          }    
//      }     
//  )
//키오스크 수정

//키오스크 삭제
router.post('/deletekiosk', (req, res) => {
    const kioskNum = req.body.kioskNum
    console.log(req.body)
    db.query("DELETE FROM kiosk_information_tb WHERE kiosk_num=?", [kioskNum], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            return res.json({
                deleteSuccess: true,
                message: `${kioskNum} 을 삭제하였습니다`
            });
        }
    })
})
//------------------------------------------------유저
//로그인


//회원리스트
router.get('/user', (req, res) => {
    db.query('SELECT * FROM inlightek3.user_information_tb', (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }

    })
})
//회원추가



router.post('/adduser', (req, res, next) => {
    const id = req.body.id
    const pw = req.body.pw
    const userLevel = req.body.userLevel
    console.log(id)
    console.log(pw)
    console.log(userLevel)
    bcrypt.hash(pw , saltRounds , (error, hash) => {
        db.query('INSERT INTO user_information_tb (id, pw, user_level) VALUES (?, ?, ?)',
            [id, hash , userLevel], (err, result) => {
                if (err) {
                    console.log(err)
                }
                else
                {
                    
                    console.log(result)
                }
            })
    })

    res.end()
})

router.post('/login', (req, res, next) => {

    const loginId = req.body.id
    const loginPw = req.body.pw
    console.log(loginId)
    console.log(loginPw)
        db.query('SELECT * FROM user_information_tb WHERE id=?', [loginId], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                if (result.length>0) {
                    
                    bcrypt.compare( loginPw, result[0].pw , (error, response)=>{
                        console.log(result[0].pw)
                        console.log(loginPw)
                        console.log(response)
                        if(error) console.log(error)
                        if(response){
                            console.log("성공")
                        }
                        else{
                            console.log("실패")
                        }
                    })
                   
                }  
                else {
                    return res.json({
                        idSuccess: false,
                        message: "해당 ID가 존재하지 않습니다."
                    });
                }
            }
        })
    
})
//회원 수정
router.put('/updateuser', (req, res) => {
    const id = req.body.id
    db.query("UPDATE SET user_information_tb ")
})
//회원삭제
router.post('/deleteuser', (req, res) => {
    const _id = req.body.id
    console.log(_id)
    db.query("DELETE FROM user_information_tb WHERE id=?", _id, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("delete success")
        }
    })
})
//------------------------------------------------광고

//광고리스트
router.get('/ad', (req, res) => {
    db.query('SELECT * FROM inlightek3.ad_information_tb', (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }

    })
})
//광고추가

//광고수정
router.put('/updatead', (req, res) => {
    const adName = req.body.adName
    db.query("UPDATE SET ad_information_tb ")
})
//광고삭제
router.delete('/deleteuser/:adName', (req, res) => {
    const _adName = req.body.adName
    db.query("DELETE FROM ad_information_tb WHERE ad_name=?", _adName, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("delete success")
        }
    })
})
//------------------------------------------------------브랜드
//브랜드 리스트
router.get('/brand', (req, res) => {
    db.query('SELECT * FROM inlightek3.brand_information_tb', (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }

    })
})
//브랜드 추가
router.post('/addbrand', (req, res, next) => {
    const adName = req.body.adName
    const adImage = req.body.adImage

    db.query('INSERT INTO brand_information_tb (brand_name, _image) VALUES (?, ?)',
        [], (err, result) => {
            if (err) {
                console.log(err)
            }
            else {

            }
        })
})
//브랜드 수정
// router.put('/updatebrand', (req, res) => {
//     const brandName = req.body.brandName
//     db.query("UPDATE SET brand_information_tb ")
// })
// //브랜드 삭제
// router.delete('/deletebrand/:brandName', (req, res) => {
//     const _brandName = req.body.brandName
//     db.query("DELETE FROM brand_information_tb WHERE ad_name=?", _brandName, (err, result) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send("delete success")
//         }
//     })
// })
//-------------------------------------------------------상품
//상품리스트
router.get('/product', (req, res) => {
    db.query('SELECT * FROM inlightek3.item_information_tb', (err, result, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            res.send(result)
        }

    })
})
//상품 추가
router.post('/addproduct', (req, res, next) => {
    const adName = req.body.adName
    const adImage = req.body.adImage
    db.query('INSERT INTO brand_information_tb (ad_name, ad_image) VALUES (?, ?)',
        [], (err, result) => {
            if (err) {
                console.log(err)
            }
            else {

            }
        })
})
//상품 수정

//상품 삭제
router.post('/deleteitem', (req, res) => {
    const _adName = req.body.adName
    db.query("DELETE FROM ad_information_tb WHERE ad_name=?", _adName, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send("delete success")
        }
    })
})

function response(res, code, message, data) {
    var resDict = {
        'result': code,
        'message': message,
        'data': data,
    }
    res.send(resDict)
}
//-------------------------------------------------------키오스크api
router.post('/api', (req, res, next) => {
    if (req.body.api_key == "eMarts#&@(Dydgh)$!(!Inlite@Key") {
        if (req.body.api_code == 'WLK_010') {
            if (req.body.unique_code != undefined) {
                db.query('SELECT * FROM inlightek3.kiosk_information_tb WHERE unique_code=? order by pk desc limit 0,1', req.body.unique_code, (err, result) => {
                    if (err)
                        response(res, -200, err.message, [])
                    else
                        response(res, 100, "성공", result)
                })
            }
            else
                response(res, -100, "unique_code missed", [])
        }
        else if (req.body.api_code == 'WLK_020') {
            db.query('SELECT * FROM inlightek3.ad_information_tb order by pk desc limit 0,1', (err, result, fields) => {
                if (err)
                    response(res, -200, err.message, [])
                else
                    response(res, 100, "성공", result)
            })
        }
        else if (req.body.api_code == 'WLK_030') {
            db.query('SELECT * FROM inlightek3.brand_information_tb', (err, result, fields) => {
                if (err)
                    response(res, -200, err.message, [])
                else
                    response(res, 100, "성공", result)
            })
        }
        else if (req.body.api_code == 'WLK_040') {
            if (req.body.brand_pk != undefined) {
                db.query('SELECT * FROM inlightek3.item_information_tb WHERE brand_pk=?', req.body.brand_pk, (err, result, fields) => {
                    if (err)
                        response(res, -200, err.message, [])
                    else
                        response(res, 100, "성공", result)
                })
            }
            else
                response(res, -100, "brand_pk missed", [])
        }
        else
            response(res, -100, "api_code missed", [])
    }
    else
        response(res, -100, "api_key missed", [])
})

module.exports = router;