const express = require('express')
const passport = require('passport')
const { json } = require('body-parser')
const router = express.Router()
const cors = require('cors')
const path = require('path')
router.use(cors())
router.use(express.json())

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const customerInterface = require('../interface/CustomerInterface')
const { checkLevel, lowLevelException, logRequestResponse, logRequest, logResponse } = require('../util')
const db = require('../config/db')
const { upload } = require('../config/multerConfig')
const salt = process.env.salt

router.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});


//--------------------------------------------------------키오스크
//키오스크 리스트
router.get('/kiosk', (req, res) => {
    if(checkLevel(req.cookies.token, 50))
    {
        db.query('SELECT * FROM kiosk_information_tb', (err, result, fields) => {
            if (err) {
                console.log(err)
            }
            else {
                logRequestResponse(req, result)
                res.send(result)
            }

        })
    }
    else
        res.send(lowLevelException)
})


 router.post('/addkiosk', (req, res) => {
    //3개 데이터 + 추가할 유저 이름(id)
    //kiostNum에 맞는 키오스크가 이미 있으면 user_pk_list에 유저 pk 추가, 없으면 새 row 생성
    const kioskNum = req.body.kioskNum
    const uniNum = req.body.uniNum
    const store = req.body.store
    const decode = checkLevel(req.cookies.token, 50)
    if(decode)
    {
        const userPk = req.body.pk;
        db.query('select * from kiosk_information_tb where kiosk_num=?', [kioskNum], (err, result) =>{
            if (result.length > 0)
            {
                let userPkListArr = result[0].user_pk_list
                let userPkList = ""
                userPkListArr = userPkListArr.substring(1, userPkListArr.length - 1).split(',').map(x => +x)
                if(userPkListArr.indexOf(userPk) == -1)
                    userPkList = '[' + userPkListArr.join() + ',' + userPk + ']'
                else
                    userPkList = '[' + userPkListArr.join() + ']'
                let sql = "update kiosk_information_tb set user_pk_list = ? WHERE kiosk_num=?"
                db.query(sql, [userPkList, kioskNum], (err,result)=>{
                    logRequestResponse(
                        req,
                        {
                            query: sql,
                            param: [userPkList, kioskNum],
                            success: (err) ? false : true
                        }
                    )
                    if(!err)
                        res.send({
                            code : 200,
                            message : "Add Success"
                        })
                    else
                        res.send({
                            code : 400,
                            message : "Add Fail"
                        })
                })
            }
            else
            {
                let sql = 'INSERT INTO kiosk_information_tb (kiosk_num, store_name, user_pk_list, unique_code) VALUES (?, ?, ?, ?)'
                db.query(sql, [kioskNum, store, '['+userPk+']',uniNum], (err, result) => {
                    logRequestResponse(
                        req,
                        {
                            query: sql,
                            param: [kioskNum, store, '['+userPk+']',uniNum],
                            success: (err) ? false : true
                        }
                    )

                    if (err) 
                        console.log(err)
                    else {
                        response = {
                            'code': res.statusCode,
                            'message': res.statusMessage,
                            'data': []
                        }
                        res.send(JSON.stringify(response))
                    }
                })
            }
        })
    }
    else
        res.send(lowLevelException)
})
//키오스크 수정
router.post('/updatekiosk', (req, res) => {
    const kioskNum = req.body.kioskNum
    const uniNum = req.body.uniNum
    const store = req.body.store
    const decode = checkLevel(req.cookies.token, 50)
    if(decode)
    {
        let sql = 'UPDATE kiosk_information_tb SET store_name=?, unique_code=? WHERE kiosk_num=?'
        db.query(sql, [store ,uniNum, kioskNum], (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: [store ,uniNum, kioskNum],
                    success: (err) ? false : true
                }
            )
            if (err) {
                console.log(err)
            } else {
                res.send({
                    code: 200,
                    message: "키오스크 수정 성공"
                })
            }
        })
    }
    else
        res.send(lowLevelException)
})
//키오스크 삭제
router.post('/deletekiosk', (req, res) => {
    if(checkLevel(req.cookies.token, 50))
    {
        const kioskNum = req.body.kioskNum
        console.log(req.body)
        let sql = "DELETE FROM kiosk_information_tb WHERE kiosk_num=?"
        db.query(sql, [kioskNum], (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: [kioskNum], 
                    success: (err) ? false : true
                }
            )

            if (err)
                console.log(err)
            else {
                return res.json({
                    deleteSuccess: true,
                    message: `${kioskNum} 을 삭제하였습니다`
                });
            }
        })
    }
    else 
        res.send(lowLevelException)
})
//------------------------------------------------유저
//로그인


//회원리스트
router.get('/user', (req, res) => {
    if(checkLevel(req.cookies.token, 50))
    {
        db.query('SELECT * FROM inlightek3.user_information_tb', (err, result, fields) => {
            logRequestResponse(
                req,
                result
            )
            if (err) {
                console.log(err)
            }
            else {
                res.send(result)
            }

        })
    }
    else
        res.send(lowLevelException)
})

//회원추가
router.post('/adduser', (req, res, next) => {
    // 값 받아올 때, id, pw, userLevel, kioskNum, brandList
    if(checkLevel(req.cookies.token, 50))
    {
        //logRequest(req)
        const id = req.body.id
        const pw = req.body.pw
        const userLevel = req.body.userLevel
        const kioskNum = req.body.kioskNum
        let brandList = req.body.brandPk
        brandList = brandList.substring(1, brandList.length - 1).split(',').map(x => +x)
        let brandSql = 'SELECT * FROM brand_information_tb WHERE '
        for(let i = 0; i < brandList.length; i++)
            brandSql += 'pk=? OR '
        brandSql = brandSql.substr(0, brandSql.length - 3)

        //중복 체크 
        let sql = "SELECT * FROM user_information_tb WHERE id=?"

        db.query(sql, [id], (err, result) => {
            if(result == undefined)
                return 
            if(result.length > 0)
            {
                logRequestResponse(
                    req,
                    {
                        query: sql,
                        param: [id], 
                        message: "ID가 중복됩니다."
                    }
                )
                res.send({
                    code: 400,
                    message: "ID가 중복됩니다." 
                })
            }
            else
            {
                bcrypt.hash(pw, salt, async (error, hash) => {
                    let userPk, userPkList, userPkListArr
                    let message = ""
                    let response = {}
                    sql = 'INSERT INTO user_information_tb (id, pw, user_level) VALUES (?, ?, ?)'
                    let insertUser = await db.query(sql , [id, hash, userLevel], (err, result) => {
                        userPk = result.insertId
                        response.sql_1 = sql
                        response.param_1 = [id, hash, userLevel]
                        response.success_1 = true
                        message += "유저 추가 성공\n"
                    })
        
                    let selectKioskUserPkList = await db.query('select * from kiosk_information_tb where kiosk_num=?' , [kioskNum], (err, result) =>{
                        if (result.length > 0)
                        {
                            if(result[0].user_pk_list == '[]' || result[0].user_pk_list == '')
                            {
                                userPkList = '[' + userPk + ']'
                            }
                            else
                            {
                                userPkListArr = result[0].user_pk_list
                                userPkList = ""
                                userPkListArr = userPkListArr.substring(1, userPkListArr.length - 1).split(',').map(x => +x)
                                if(userPkListArr.indexOf(userPk) == -1)
                                    userPkList = '[' + userPkListArr.join() + ',' + userPk + ']'
                                else
                                    userPkList = '[' + userPkListArr.join() + ']'
                            }
                            sql = "update kiosk_information_tb set `user_pk_list`=? WHERE kiosk_num=?"
                            db.query(sql, [userPkList, kioskNum], (err,result)=>{
                                response.sql_2 = sql
                                response.param_2 = [userPkList, kioskNum]
                                response.success_2 = (err) ? false : true
                                if(err)
                                {
                                    message += "키오스크 관리 유저 추가 실패\n"
                                    console.log(err)
                                }
                                else{
                                    message += "키오스크 관리 유저 추가 성공\n"
                                    return result
                                }
                            })
                        }
                    })
        
                    db.query(brandSql, brandList, async (err, result, fields) => {
                        if(result == undefined)
                        {
                            message += "브랜드 관리 유저 추가 실패\n"
                        }
                        else if(result.length > 0)
                        {
                            response.sql_3 = "UPDATE brand_information_tb SET user_pk_list=? WHERE pk=?"
                            for(let i = 0; i < result.length; i++)
                            {
                                if(result[i].user_pk_list == '[]' || result[0].user_pk_list == '')
                                {
                                    userPkList = '[' + userPk + ']'
                                }
                                else
                                {
                                    userPkListArr = result[i].user_pk_list
                                    userPkList = ""
                                    userPkListArr = userPkListArr.substring(1, userPkListArr.length - 1).split(',').map(x => +x)
                                    if(userPkListArr.indexOf(userPk) == -1)
                                        userPkList = '[' + userPkListArr.join() + ',' + userPk + ']'
                                    else
                                        userPkList = '[' + userPkListArr.join() + ']'
                                }
                                response.param_3 += '[' + userPkList +',' + result[i].pk +']'
        
                                await db.query("UPDATE brand_information_tb SET user_pk_list=? WHERE pk=?", [userPkList, result[i].pk], (err, result) =>{
                                    response.success_3 = (err) ? false : true
                                    if(err)
                                        console.log(err)
                                })
        
                                if(i == result.length - 1)
                                {
                                    logRequestResponse(req, response)
                                    return res.send({message})
                                }
                            }
                        }
                    })
                })
            }
        })
        //res.end()
    }
    else
        res.send(lowLevelException);
})

// 권한 체크
router.get('/auth', (req, res, next) => {
    const decode = checkLevel(req.cookies.token, 0)

    if(decode)
    {
        let id = decode.id
        let first = decode.user_level == 50
        let second = decode.user_level >= 40
        let third = decode.user_level >= 0
        res.send({id,first, second, third})
    }
    else
    {
        res.send({
            id: decode.id,
            first: false,
            second: false,
            third: false
        })
    }
})

router.post('/login', (req, res, next) => {
    try{
        let level = ["일반유저", "관리자", "개발자"];
        
        console.log(req.socket.remoteAddress + '\n' + req.ip);
        passport.authenticate('local', {session : false}, async (err, user, info) => {
            console.log(user);

            if (!user) {
                console.log(info.message);
                logRequestResponse(
                    req,
                    {
                        idSuccess: false,
                        message: "해당 ID가 존재하지 않습니다."
                    }
                )

                return res.json({
                    idSuccess: false,
                    message: "해당 ID가 존재하지 않습니다."
                });
            }

            try{
                var expiresTime;

                if(user.userLevel < 40){
                    expiresTime='15m'
                }else{
                    expiresTime='60m'
                }

                console.log(user.id + '\n' + user.user_level);
                const token = jwt.sign({
                    code : user.pk,
                    id : user.id,
                    user_level : user.user_level
                },
                process.env.JWT_SECRET,
                {
                    expiresIn : '15m',
                    issuer : 'fori',
                });
            
                /*
                **  TODO: 
                **  토큰 갱신 필요하면 refresh, newToken 활성화
                **  갱신용 refresh token DB에 저장 후 받은 refresh 토큰과 DB의 refresh 토큰을 비교
                */

                // const refreshtoken = jwt.sign(
                // {
                //     id : user.id,
                // },
                // process.env.JWT_SECRET,
                // {
                //     expiresIn : '60m',
                //     issuer : 'fori',
                // });

                res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000});
                // res.cookie("rtoken", refreshtoken, { httpOnly: true, maxAge: 60 * 60 * 1000});

                let user_type = ""
                if(user.user_level === 0)
                    user_type = level[0]
                else if(user.user_level === 40)
                    user_type = level[1]
                else if(user.user_level === 50)
                    user_type = level[2]
                else
                    user_type = "비정상"
                
                logRequestResponse(
                    req,
                    {
                        code: 200,
                        message: user.id + '(' + user_type + ')님 환영합니다.',
                        token
                    }
                )

                return res.status(200).json({
                    code: 200,
                    message: user.id + '(' + user_type + ')님 환영합니다.',
                    token,
                    // refreshtoken,
                }).send();
            }
            catch(err){
                console.log(err);
                logRequestResponse(
                    req,
                    {
                        code: 400,
                        message: "에러입니다.",
                        err: err
                    }
                )
                return res.status(400).json({
                    code: 400,
                    message: "에러입니다."
                }).send();
            }
        })(req, res, next); 
    }
    catch(err){
        console.log(err);
        res.send("에러입니다.");
    }
})

router.post('/logout', (req, res, next) => {
    res.clearCookie('token')
    //res.clearCookie('rtoken')
    res.send()
});

// router.post('/newToken',function(req,res,next){
//     var refreshtoken = req.cookies.refreshtoken;
//     var tokenValue=jwt.decode(authorization);
//     var userId = tokenValue.id;
//     db.query('SELECT refresh_token FROM user_information_tb WHERE id=?', [userId], (err, result) => {
//         if(isEmpty(result)){
//             res.json({
//                 code:400,
//                 message:"토큰이 만료되었습니다. 재 로그인 해주세요."
//             });
//         }else if(result==refreshtoken){
//             var expiresTime;
//             if(tokenValue.status==0){
//                 expiresTime='60m';
//             }else{
//                 expiresTime='1440m'
//             }
//             const token = jwt.sign({
//                 user_id : tokenValue.user_id,
//                 user_level : tokenValue.user_level,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn : expiresTime,
//                 issuer : 'comeOn',
//             });
      
//         res.status(200).json({
//             code : 200,
//             message : '토큰이 발급되었습니다.',
//             token,
//         }).send();  
//     }else{
//         res.json({
//             code:500,
//             message:"토큰이 변조되었습니다. 재 로그인 해주세요."
//         });
//     }
//     })
// });

//회원 수정
router.put('/updateuser', (req, res) => {
    const id = req.body.id
    const pw = req.body.pw
    const decode = checkLevel(req.cookies.token, 50)
    if(decode)
    {
        let sql = 'UPDATE user_information_tb SET pw=? WHERE id=?'
        db.query( sql, [pw, id], (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: [pw, id],
                    success: (err) ? false : true 
                }
            )
            if (err) {
                console.log(err)
            } else {
                res.send({
                    code: 200,
                    message: "비밀번호 수정 성공"
                })
            }
        })
    }
    else
        res.send(lowLevelException)
})
//회원삭제
router.post('/deleteuser', async (req, res) => {
    if(checkLevel(req.cookies.token, 50))
    {
        const _id = req.body.id
        let sql = "DELETE FROM user_information_tb WHERE id=?"
        await db.query(sql, _id, (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: _id,
                    success: (err) ? false : true 
                }
            )
            if (err) {
                console.log(err)
            } else {
                res.send("delete success")
            }
        })

    }
    else
        res.send(lowLevelException)
})
//------------------------------------------------광고

//광고리스트
router.get('/ad', (req, res) => {
    if(checkLevel(req.cookies.token, 40))
    {
        db.query('SELECT * FROM inlightek3.ad_information_tb', (err, result, fields) => {
            logRequestResponse( req, result )
            if (err) {
                console.log(err)
            }
            else {
                res.send(result)
            }

        })
    }
    else
        res.send(lowLevelException)
})
//광고추가

//광고수정
router.put('/updatead', upload.single('image'), (req, res) => {
    const decode = checkLevel(req.cookies.token, 40)
    if(decode)
    {
        const pk = req.body.pk;
        const adName = req.body.adName;
        const image = "/image/ad/" + req.file.filename;
        let sql = 'UPDATE ad_information_tb SET ad_name=?, ad_image=? WHERE pk=?'
        db.query( sql, [adName, image, pk], (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: [adName, image, pk],
                    success: (err) ? false : true 
                }
            )
            if (err) {
                console.log(err)
            } else {
                res.send({
                    code: 200,
                    message: "광고 수정 성공"
                })
            }
        })
    }
    else
        res.send(lowLevelException)
})
//광고삭제
router.delete('/deleteuser/:adName', (req, res) => {

    const _adName = req.body.adName
    let sql = "DELETE FROM ad_information_tb WHERE ad_name=?"
    db.query(sql, _adName, (err, result) => {
        logRequestResponse(
            req,
            {
                query: sql,
                param: _adName,
                success: (err) ? false : true 
            }
        )
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
    let decode = checkLevel(req.cookies.token, 40);
    let brandList = []
    if(decode)
    {
        db.query('SELECT * FROM inlightek3.brand_information_tb', (err, result, fields) => {
            logRequestResponse(req, result)
            for(let i = 0; i < result.length; i++) {
                let users = result[i].user_pk_list
                users = users.substring(1, users.length - 1).split(',').map(x => +x)
                if(users.indexOf(decode.code) != -1)
                    brandList.push(result[i])
            }
            if (err) {
                console.log(err)
            }
            else {
                res.send(brandList)
            }

        })
    }
    else
        res.send(lowLevelException)
})
//브랜드 추가
router.post('/addbrand', (req, res, next) => {
    if(checkLevel(req.cookies.token, 50))
    {
        const brandName = req.body.brandName
        const middleClass1 = req.body.middleClass1
        const middleClass2 = req.body.middleClass2
        const middleClass3 = req.body.middleClass3
        const middleClass4 = req.body.middleClass4
        const status = req.body.status 
        let sql = 'INSERT INTO brand_information_tb (brand_name, middle_class_1, middle_class_2, middle_class_3, middle_class_4) VALUES (?, ?, ?, ?, ?, ?)'
        db.query(sql, [brandName, middleClass1, middleClass2, middleClass3, middleClass4, status], (err, result) => {
                logRequestResponse(
                    req,
                    {
                        query: sql,
                        param: [brandName, middleClass1, middleClass2, middleClass3, middleClass4, status],
                        success: (err) ? false : true 
                    }
                )
                if (err) {
                    console.log(err)
                }
                else {

                }
            })
    }
    else
        res.send(lowLevelException)
})

//브랜드 수정
router.put('/updatebrand', (req, res) => {
    const decode = checkLevel(req.cookies.token, 50)
    if(decode)
    {
        const pk = req.body.pk;
        const brandName = req.body.brandName
        const middleClass1 = req.body.middleClass1
        const middleClass2 = req.body.middleClass2
        const middleClass3 = req.body.middleClass3
        const middleClass4 = req.body.middleClass4
        let sql = 'UPDATE brand_information_tb SET brand_name=?, middle_class_1=?, middle_class_2=?, middle_class_3=?, middle_class_4=? WHERE pk=?'
        db.query( sql, [brandName, middleClass1, middleClass2, middleClass3, middleClass4, pk], (err, result) => {
                logRequestResponse(
                    req,
                    {
                        query: sql,
                        param: [brandName, middleClass1, middleClass2, middleClass3, middleClass4, pk],
                        success: (err) ? false : true 
                    }
                )
                if (err) {
                    console.log(err)
                } else {
                    res.send({
                        code: 200,
                        message: "브랜드 수정 성공"
                    })
                }
            }
        )
    }
    else
        res.send(lowLevelException)
})

//브랜드 삭제
router.delete('/deletebrand/:brandName', (req, res) => {
    const decode = checkLevel(req.cookies.token, 0)
    if(decode)
    {
        const _brandName = req.body.brandName
        let sql = "DELETE FROM brand_information_tb WHERE brand_name=?"
        db.query(sql, _brandName, (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: _brandName,
                    success: (err) ? false : true 
                }
            )
            if (err) {
                console.log(err)
            } else {
                res.send("delete success")
            }
      })
    }
    else
        res.send(lowLevelException)
})

//-------------------------------------------------------상품
//상품리스트
router.get('/product', async (req, res) => {
    const decode = checkLevel(req.cookies.token, 0)
    if(decode)
    {
        let brandPks = await db.query('SELECT * FROM inlightek3.brand_information_tb', (err, result, fields) => {
            if(result.length > 0)
            {
                let brandPk = []

                for(let i = 0; i < result.length; i++) {
                    let users = result[i].user_pk_list
                    users = users.substring(1, users.length - 1).split(',').map(x => +x)
                    if(users.indexOf(decode.code) != -1)
                        brandPk.push(result[i].pk);
                }

                if(brandPk.length == 0)
                {
                    logRequestResponse(
                        req,
                        {message: "소유한 상품이 없습니다."}
                    )
                    res.send({ message: "소유한 상품이 없습니다." })
                }
                else{
                    let sql = 'SELECT * FROM inlightek3.item_information_tb WHERE '
                    for(let i = 0; i < brandPk.length; i++)
                        sql += 'brand_pk=? OR '
                    sql = sql.substr(0, sql.length - 3)
                    // console.log(sql, brandPk)
                    db.query(sql, brandPk, (err, result, fields) => {
                        logRequestResponse( req, result)
                        if (err) {
                            console.log(err)
                        }
                        else {
                            res.send(result)
                        }
                    })
                }
            }
        })
    }
    else
        res.send(lowLevelException)
})
//상품 수정
router.post('/updateitem', upload.fields([{name : 'mainImage'}, {name : 'detailImage'}, {name : 'qrImage'}]), (req, res) => {
    const decode = checkLevel(req.cookies.token, 0)
    if(decode)
    {
        const pk = req.body.pk
        const brandPk = req.body.brandPk
        const itemNum = req.body.itemNum
        const classification = req.body.classification
        const middleClass = req.body.middleClass
        const status = req.body.status

        const mainImage = "/image/item/" + req.files.mainImage[0].filename
        const detailImage = "/image/detailItem/" + req.files.detailImage[0].filename
        const qrImage = "/image/qr/" + req.files.qrImage[0].filename

        let sql = 'UPDATE item_information_tb SET brand_pk=?, item_num=?, item_name=?, classification=?, middle_class=?, main_image=?, detail_image=?, qr_image=?, status=? WHERE pk=?'
        let param = [brandPk, itemNum, itemName, classification, middleClass, mainImage, detailImage, qrImage, status, pk]
        db.query( sql, param, (err, result) => {
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
            } else {
                res.send({
                    code: 200,
                    message: "상품 수정 성공"
                })
            }
        })
    }
    else
        res.send(lowLevelException)
})
//상품 삭제
router.post('/deleteitem', (req, res) => {
    if(checkLevel(req.cookies.token, 0))
    {
        const _adName = req.body.adName
        let sql = "DELETE FROM ad_information_tb WHERE ad_name=?"
        db.query(sql, _adName, (err, result) => {
            logRequestResponse(
                req,
                {
                    query: sql,
                    param: _adName,
                    success: (err) ? false : true 
                }
            )
            if (err) {
                console.log(err)
            } else {
                res.send("delete success")
            }
        })
    }
    else
        res.send(lowLevelException)
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
                if(req.body.brand_pk==0){
                    db.query('SELECT * FROM inlightek3.item_information_tb WHERE brand_pk=?',1,(err, result, fields)=>{
                        if(err)
                            response(res, -200, err.message, []) 
                        else
                            response(res, 100, "성공", result)
                    })
                }
                else{
                    response(res, -100, "brand_pk missed", [])
                }
                
        }
        else
            response(res, -100, "api_code missed", [])
    }
    else
        response(res, -100, "api_key missed", [])
})

module.exports = router;