const express = require('express')
const passport = require('passport')
//const { json } = require('body-parser')
const router = express.Router()
const cors = require('cors')
router.use(cors())
router.use(express.json())

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { checkLevel, getSQLnParams, logRequestResponse, getUserPKArrStrWithNewPK, isNotNullOrUndefined, namingImagesPath, nullResponse, lowLevelResponse, response} = require('../util')
const db = require('../config/db')
const { upload } = require('../config/multerConfig')
//const { pbkdf2 } = require('crypto')
const salt = process.env.salt

router.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});

//--------------------------------------------------------키오스크
//키오스크 리스트
router.get('/kiosk/:page', (req, res) => {
    try{
        if(checkLevel(req.cookies.token, 50))
        {
            let page = ((req.params.page || req.body.page) - 1) * 10;
            if(isNotNullOrUndefined([page]))
                {
                let maxPage = 0;
                let selectRows = "select TABLE_ROWS FROM information_schema.tables WHERE TABLE_NAME='kiosk_information_tb'";
                db.query(selectRows, (err, result) => {
                    maxPage = parseInt((result[0].TABLE_ROWS) / 10 + 0.9);
                    if(err)
                    {
                        console.log(err)
                        response(req, res, -200, "키오스크 조회 실패", []);
                    }
                    else
                    {
                        let sql = ``
                        let keyword = req.query.keyword
                        if(keyword)
                        {
                            sql = `
                            SELECT * FROM kiosk_information_tb 
                            WHERE kiosk_num LIKE '%` + keyword + `%' 
                            OR store_name LIKE '%` + keyword + `%'
                            OR unique_code LIKE '%` + keyword + `%'
                            OR status LIKE '%` + keyword + `%'
                            ORDER BY pk DESC LIMIT ` + page + `, 10`
                        }
                        else 
                            sql = 'SELECT * FROM kiosk_information_tb ORDER BY pk DESC LIMIT ' + page + ', 10'
                        db.query(sql, (err, result, fields) => {
                            if (err) {
                                console.log(err)
                                response(req, res, -200, "키오스크 조회 실패", []);
                            }
                            else {
                                response(req, res, 200, "키오스크 조회: "+ keyword, {result, maxPage})
                            }
                        })
                    }
                })
            }
            else
                nullResponse(req, res)
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//키오스크 전체 조회(pk, kiosk_num만)
router.get('/kiosk', (req, res) => {
    try{
        if(checkLevel(req.cookies.token, 50))
        {
            let sql = 'SELECT pk, kiosk_num FROM kiosk_information_tb'
            db.query(sql, (err, result, fields) => {
                if (err) {
                    console.log(err)
                    response(req, res, -200, "키오스크 조회 실패", []);
                }
                else {
                    response(req, res, 200, "키오스크 조회: ", result)
                }
            })
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

 router.post('/addkiosk', (req, res) => {
    //3개 데이터 + 추가할 회원 이름(id)
    //kiostNum에 맞는 키오스크가 이미 있으면 user_pk_list에 회원 pk 추가, 없으면 새 row 생성
    try{
        const decode = checkLevel(req.cookies.token, 50)
        if(decode)
        {
            const kioskNum = req.body.kioskNum
            const uniNum = req.body.uniNum
            const store = req.body.store
            const userPK = req.body.pk
            if(isNotNullOrUndefined([kioskNum, uniNum, store, userPK]))
            {
                db.query('select * from kiosk_information_tb where kiosk_num=?', [kioskNum], (err, result) =>{
                    if (result.length > 0)
                    {
                        let userPKList = getUserPKArrStrWithNewPK(result[0].user_pk_list, userPK)

                        let sql = "update kiosk_information_tb set user_pk_list = ? WHERE kiosk_num=?"
                        db.query(sql, [userPKList, kioskNum], (err,result)=>{
                            if(!err)
                                response(req, res, 200, "기존 키오스크에 추가 성공", [])
                            else
                            {
                                console.log(err)
                                response(req, res, -200, "키오스크 추가 실패", [])
                            }
                        })
                    }
                    else
                    {
                        let sql = 'INSERT INTO kiosk_information_tb (kiosk_num, store_name, user_pk_list, unique_code) VALUES (?, ?, ?, ?)'
                        db.query(sql, [kioskNum, store, '['+decode.code+']',uniNum], (err, result) => {
                            if(!err)
                                response(req, res, 200, "새 키오스크 추가 성공", [])
                            else
                            {
                                console.log(err)
                                response(req, res, -200, "키오스크 추가 실패", [])
                            }
                        })
                    }
                })
            }
            else
                nullResponse(req, res)
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//키오스크 수정
router.put('/updatekiosk', (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 50)
        if(decode)
        {
            const pk = req.body.pk
            const num = req.body.num
            const uniNum = req.body.uniNum
            const store = req.body.store
            let query = 'UPDATE kiosk_information_tb SET '
            let params = [num, uniNum, store]
            let {sql, param} = getSQLnParams(query, params, ['kiosk_num', 'unique_code','store_name'])
            sql += ' WHERE pk=?'
            param.push(pk)
            if(param.length == 1)
                return response(req, res, -200, "입력된 데이터가 없습니다.", [])

            if(isNotNullOrUndefined(param))
            {
                db.query(sql, param, (err, result) => {
                    if(!err)
                        response(req, res, 200, "키오스크 수정 성공", [])
                    else
                    {
                        console.log(err)
                        response(req, res, -200, "키오스크 수정 실패", [])
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//키오스크 삭제
router.post('/deletekiosk', (req, res) => {
    try{
        const pk = req.body.pk
        const decode = checkLevel(req.cookies.token, 40)
        if(decode)
        {
            let param = [pk]
            if(isNotNullOrUndefined(param))
            {
                let sql = "DELETE FROM kiosk_information_tb WHERE pk=?"
                db.query(sql, param, (err, result) => {
                    if(!err)
                        response(req, res, 200, "키오스크 삭제 성공", [])
                    else
                    {
                        console.log(err)
                        response(req, res, -200, "키오스크 삭제 실패", [])
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//------------------------------------------------유저
//로그인


//회원리스트
router.get('/user/:page', (req, res) => {
    try{
        if(checkLevel(req.cookies.token, 50))
        {
            let page = ((req.params.page || req.body.page) - 1) * 10;
            if(isNotNullOrUndefined([page]))
            {
                let maxPage = 0;
                let selectRows = "select TABLE_ROWS FROM information_schema.tables WHERE TABLE_NAME='user_information_tb'";
                db.query(selectRows, (err, result) => {
                    maxPage = parseInt((result[0].TABLE_ROWS) / 10 + 0.9);
                    if(err)
                    {
                        console.log(err)
                        response(req, res, -200, "회원 조회 실패", [])
                    }
                    else
                    {
                        let sql = ``
                        let keyword = req.query.keyword
                        if(keyword)
                        {
                            sql = `
                            SELECT * FROM user_information_tb 
                            WHERE id LIKE '%` + keyword + `%' 
                            OR user_level LIKE '%` + keyword + `%'
                            ORDER BY pk DESC LIMIT ` + page + `, 10`
                        }
                        else 
                            sql = 'SELECT * FROM user_information_tb ORDER BY pk DESC LIMIT ' + page + ', 10'
                        db.query(sql, (err, result, fields) => {
                            if(!err)
                                response(req, res, 200, "회원 조회 성공", {result, maxPage})
                            else
                            {
                                console.log(err)
                                response(req, res, -200, "회원 조회 실패", [])
                            }
                        })
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//회원추가
router.post('/adduser', (req, res, next) => {
    // 값 받아올 때, id, pw, userLevel, kioskNum, brandList
    try{
        if(checkLevel(req.cookies.token, 50))
        {
            //logRequest(req)
            const id = req.body.id
            const pw = req.body.pw
            const userLevel = req.body.userLevel
            let kioskList = req.body.kioskList
            let kioskSQL = 'SELECT * FROM kiosk_information_tb WHERE pk IN (' + kioskList.substring(1, kioskList.length - 1) +')'
            kioskList = JSON.parse(kioskList)
            let brandList = req.body.brandPk
            let brandSQL = 'SELECT * FROM brand_information_tb WHERE pk IN (' + brandList.substring(1, brandList.length - 1) +')'
            brandList = JSON.parse(brandList)

            if(isNotNullOrUndefined([id, pw, userLevel, kioskList, brandList]))
            {
                //중복 체크 
                let sql = "SELECT * FROM user_information_tb WHERE id=?"

                db.query(sql, [id], (err, result) => {
                    if(result.length > 0)
                        response(req, res, -200, "ID가 중복됩니다.", [])
                    else
                    {
                        bcrypt.hash(pw, salt, async (err, hash) => {
                            if(err)
                            {
                                console.log(err)
                                response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                            }
                            let userPK, userPKList
                            sql = 'INSERT INTO user_information_tb (id, pw, user_level) VALUES (?, ?, ?)'
                            await db.query(sql , [id, hash, userLevel], (err, result) => {
                                userPK = result.insertId
                                if(err)
                                {
                                    console.log(err)
                                    response(req, res, -200, "회원 추가 실패", [])
                                }
                            })
                            
                            await db.query(kioskSQL, kioskList, async (err, result, fields) => {
                                if(result == undefined || err)
                                {
                                    !err || console.log(err)
                                    response(req, res, err ? -200 : 200, "회원 추가 성공, 키오스크 등록 " + err ? "중 오류":"없음", [])
                                }
                                else if(result.length > 0)
                                {
                                    sql = "UPDATE kiosk_information_tb SET user_pk_list=? WHERE pk=?"
                                    for(let i = 0; i < result.length; i++)
                                    {
                                        userPKList = JSON.parse(result[0].user_pk_list)
                                        if(userPKList.indexOf(userPK) == -1)
                                            userPKList.push(userPK)
                                        userPKList = JSON.stringify(userPKList)
                
                                        await db.query("UPDATE kiosk_information_tb SET user_pk_list=? WHERE pk=?", [userPKList, result[i].pk], (err, result) =>{
                                            if(err)
                                            {
                                                console.log(err)
                                                response(req, res, -200, "회원 추가 성공, "+ i +"번 키오스크 등록 중 실패", [])
                                            }
                                        })
                                    }
                                }
                            })
                
                            await db.query(brandSQL, brandList, async (err, result, fields) => {
                                if(result == undefined || err)
                                {
                                    !err || console.log(err)
                                    response(req, res, err ? -200 : 200, "회원 추가 성공, 키오스크 등록 성공, 브랜드 등록 " + err ? "중 오류":"없음", [])
                                }
                                else if(result.length > 0)
                                {
                                    sql = "UPDATE brand_information_tb SET user_pk_list=? WHERE pk=?"
                                    for(let i = 0; i < result.length; i++)
                                    {
                                        userPKList = JSON.parse(result[0].user_pk_list)
                                        if(userPKList.indexOf(userPK) == -1)
                                            userPKList.push(userPK)
                                        userPKList = JSON.stringify(userPKList)
                
                                        await db.query("UPDATE brand_information_tb SET user_pk_list=? WHERE pk=?", [userPKList, result[i].pk], (err, result) =>{
                                            if(err)
                                            {
                                                console.log(err)
                                                response(req, res, -200, "회원 추가 성공, 키오스크 등록 성공, "+ i +"번 브랜드 등록 중 실패", [])
                                            }
                                        })
                
                                        if(i == result.length - 1)
                                            response(req, res, 200, "회원 추가 성공, 키오스크 등록 성공, 브랜드 등록 성공", [])
                                    }
                                }
                            })
                        })
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res);
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

// 권한 체크
router.get('/auth', (req, res, next) => {
    try{
        const decode = checkLevel(req.cookies.token, 0)

        if(decode)
        {
            let id = decode.id
            let first = decode.user_level == 50
            let second = decode.user_level >= 40
            let third = decode.user_level >= 0
            res.send({id, first, second, third})
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
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

router.post('/login', (req, res, next) => {
    try{
        let level = ["일반회원", "관리자", "개발자"];
        
        passport.authenticate('local', {session : false}, async (err, user, info) => {

            if (!user) 
                return response(req, res, -200, "해당 계정이 존재하지 않습니다.", []);

            try{
                var expiresTime;

                if(user.userLevel < 40){
                    expiresTime='15m'
                }else{
                    expiresTime='60m'
                }

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

                res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 1000});
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
                
                return response(req, res, 200, user.id + '(' + user_type + ')님 환영합니다.', []);
            }
            catch(err){
                console.log(err);
                return response(req, res, -200, "로그인 중 오류 발생", [])
            }
        })(req, res, next); 
    }
    catch(err){
        console.log(err);
        response(req, res, -200, "로그인 중 오류 발생", [])
    }
})

router.post('/logout', (req, res, next) => {
    try{
        res.clearCookie('token')
        //res.clearCookie('rtoken')
        response(req, res, 200, "로그아웃 성공", [])
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
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
    try{
        const decode = checkLevel(req.cookies.token, 50)
        if(decode)
        {
            const pk = req.body.pk
            const pw = req.body.pw
            const param = [pw, pk]
            if(isNotNullOrUndefined(param))
            {
                bcrypt.hash(pw, salt, (err, hash) => {
                    if(err)
                    {
                        console.log(err)
                        response(req, res, -200, "회원 수정 실패", [])
                    }
                    let sql = 'UPDATE user_information_tb SET pw=? WHERE pk=?'
                    db.query( sql, [hash, pk], (err, result) => {
                        if (err) {
                            console.log(err)
                            response(req, res, -200, "회원 수정 실패", [])
                        } else {
                            response(req, res, 200, "회원 수정 성공", [])
                        }
                    })
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//회원삭제
router.post('/deleteuser', async (req, res) => {
    try{
        if(checkLevel(req.cookies.token, 50))
        {
            const pk = req.body.pk
            const param = [pk]
            if(isNotNullOrUndefined(param))
            {
                let sql = "DELETE FROM user_information_tb WHERE pk=?"
                await db.query(sql, param, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "회원 삭제 실패", [])
                    } else {
                        response(req, res, 200, "회원 삭제 성공", [])
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//------------------------------------------------광고

//광고리스트
router.get('/ad/:page', (req, res) => {
    try{
        if(checkLevel(req.cookies.token, 40))
        {
            let page = ((req.params.page || req.body.page) - 1) * 10;
            if(isNotNullOrUndefined([page]))
            {
                let maxPage = 0;
                let selectRows = "select TABLE_ROWS FROM information_schema.tables WHERE TABLE_NAME='ad_information_tb'";
                db.query(selectRows, (err, result) => {
                    maxPage = parseInt((result[0].TABLE_ROWS) / 10 + 0.9);
                    if(err)
                    {
                        console.log(err)
                        response(req, res, -200, "광고 조회 실패", [])
                    }
                    else
                    {
                        let sql = ``
                        let keyword = req.query.keyword
                        if(keyword)
                        {
                            sql = `
                            SELECT * FROM ad_information_tb 
                            WHERE ad_name LIKE '%` + keyword + `%' 
                            OR ad_image LIKE '%` + keyword + `%'
                            ORDER BY pk DESC LIMIT ` + page + `, 10`
                        }
                        else 
                            sql = 'SELECT * FROM ad_information_tb ORDER BY pk DESC LIMIT ' + page + ', 10'
                        db.query(sql, (err, result, fields) => {
                            if (err) {
                                console.log(err)
                                response(req, res, -200, "광고 조회 실패", [])
                            } else {
                                response(req, res, 200, "광고 조회 성공", {result, maxPage})
                            }
                        })
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//광고수정창에서 광고정보 가져오기
//광고수정
router.put('/updatead', upload.single('image'), (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 40)
        if(decode)
        {
            const pk = req.body.pk;
            const adName = req.body.adName;
            const {image, isNull} = namingImagesPath("ad", req.file)
            let query = 'UPDATE ad_information_tb SET '
            let params = [adName]
            let colNames = ['ad_name']
            if(!isNull) { params.push(image); colNames.push('ad_image') }
            let {sql, param} = getSQLnParams(query, params, colNames)

            sql += ' WHERE pk=?'
            param.push(pk)

            if(param.length == 1)
                return response(req, res, -200, "입력된 데이터가 없습니다.", [])

            if(isNotNullOrUndefined(param))
            {
                db.query( sql, param, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "광고 수정 실패", [])
                    } else {
                        response(req, res, 200, "광고 수정 성공", [])
                    }
                })
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//광고삭제
router.post('/deletead', (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 40)
        if(decode)
        {
            const pk = req.body.pk
            const param = [pk]
            if(isNotNullOrUndefined(param))
            {
                let sql = "DELETE FROM ad_information_tb WHERE pk=?"
                db.query(sql, param, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "광고 삭제 실패", [])
                    } else {
                        response(req, res, 200, "광고 삭제 성공", [])
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//------------------------------------------------------브랜드
//브랜드 리스트
router.get('/brand/:page', (req, res) => {
    try{
        let decode = checkLevel(req.cookies.token, 40);
        let brandList = []
        if(decode)
        {
            let page = ((req.params.page || req.body.page) - 1) * 10;
            if(isNotNullOrUndefined([page]))
            {
                let maxPage = 0;
                let selectRows = "select TABLE_ROWS FROM information_schema.tables WHERE TABLE_NAME='brand_information_tb'";
                db.query(selectRows, (err, result) => {
                    maxPage = parseInt((result[0].TABLE_ROWS) / 10 + 0.9);
                    if(err)
                    {
                        console.log(err)
                        response(req, res, -200, "브랜드 조회 실패", [])
                    }
                    else
                    {
                        let sql = ``
                        let keyword = req.query.keyword
                        if(keyword)
                        {
                            sql = `
                            SELECT * FROM brand_information_tb 
                            WHERE brand_name LIKE '%` + keyword + `%' 
                            OR middle_class_1 LIKE '%` + keyword + `%' 
                            OR middle_class_2 LIKE '%` + keyword + `%'
                            OR middle_class_3 LIKE '%` + keyword + `%'
                            OR middle_class_4 LIKE '%` + keyword + `%'
                            OR status LIKE '%` + keyword + `%' 
                            ORDER BY pk DESC LIMIT ` + page + `, 10`
                        }
                        else 
                            sql = 'SELECT * FROM brand_information_tb ORDER BY pk DESC LIMIT ' + page + ', 10'
                        db.query(sql, (err, result, fields) => {
                            if (err) {
                                console.log(err)
                                response(req, res, -200, "광고 조회 실패", [])
                            }
                            else
                            {
                                for(let i = 0; i < result.length; i++) {
                                    let users = result[i].user_pk_list
                                    users = users.substring(1, users.length - 1).split(',').map(x => +x)
                                    if(users.indexOf(decode.code) != -1)
                                        brandList.push(result[i])
                                }
                                response(req, res, 200, "광고 조회 성공", {result: brandList, maxPage})
                            }
                        })
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//브랜드 추가
// router.post('/addbrand', (req, res, next) => {
//     if(checkLevel(req.cookies.token, 50))
//     {
//         const brandName = req.body.brandName
//         const middleClass1 = req.body.middleClass1
//         const middleClass2 = req.body.middleClass2
//         const middleClass3 = req.body.middleClass3
//         const middleClass4 = req.body.middleClass4
//         const status = req.body.status 
//         const param = [brandName, middleClass1, middleClass2, middleClass3, middleClass4, status]
//         if(isNotNullOrUndefined(param))
//         {
//             let sql = 'INSERT INTO brand_information_tb (brand_name, middle_class_1, middle_class_2, middle_class_3, middle_class_4) VALUES (?, ?, ?, ?, ?, ?)'
//             db.query(sql, param, (err, result) => {
//                 logRequestResponse(
//                     req,
//                     {
//                         query: sql,
//                         param: param,
//                         success: (err) ? false : true,
//                         err: (err) ? err.message : '' 
//                     }
//                 )
//                 if (err) {
//                     console.log(err)
//                     response(req, res, -200, "브랜드 추가 실패", [])
//                 } else {
//                     response(req, res, 200, "브랜드 추가 성공", [])
//                 }
//             })
//         }
//         else
//         {
//             nullResponse(req, res)
//         }
//     }
//     else
//         lowLevelResponse(req, res)
// })

//브랜드 수정
router.put('/updatebrand', (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 50)
        if(decode)
        {
            const pk = req.body.pk;
            const brandName = req.body.brandName
            const middleClass1 = req.body.middleClass1
            const middleClass2 = req.body.middleClass2
            const middleClass3 = req.body.middleClass3
            const middleClass4 = req.body.middleClass4
            const status = req.body.status
            const param = [brandName, middleClass1, middleClass2, middleClass3, middleClass4, status, pk]
            if(isNotNullOrUndefined(param))
            {
                let sql = 'UPDATE brand_information_tb SET brand_name=?, middle_class_1=?, middle_class_2=?, middle_class_3=?, middle_class_4=?, status=? WHERE pk=?'
                db.query( sql, param, (err, result) => {
                        if (err) {
                            console.log(err)
                            response(req, res, -200, "브랜드 수정 실패", [])
                        } else {
                            response(req, res, 200, "브랜드 수정 성공", [])
                        }
                    }
                )
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//브랜드 삭제 
// router.delete('/deletebrand/:brandName', (req, res) => {
//     const decode = checkLevel(req.cookies.token, 0)
//     if(decode)
//     {
//         const brandName = req.body.brandName
//         const param = [brandName]
//         if(isNotNullOrUndefined(param))
//         {
//             let sql = "DELETE FROM brand_information_tb WHERE brand_name=?"
//             db.query(sql, param, (err, result) => {
//                 logRequestResponse(
//                     req,
//                     {
//                         query: sql,
//                         param: param,
//                         success: (err) ? false : true,
//                         err: (err) ? err.message : '' 
//                     }
//                 )
//                 if (err) {
//                     console.log(err)
//                     response(req, res, -200, "브랜드 삭제 실패", [])
//                 } else {
//                     response(req, res, 200, "브랜드 삭제 성공", [])
//                 }
//             })
//         }
//         else
//         {
//             nullResponse(req, res)
//         }
//     }
//     else
//         lowLevelResponse(req, res)
// })

//-------------------------------------------------------상품
//상품리스트
router.get('/product/:page', (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 0)
        if(decode)
        {
            if(isNotNullOrUndefined([req.params.page]))
            {
                db.query('SELECT * FROM brand_information_tb', (err, result, fields) => {
                    if(err)
                    {
                        console.log(err)
                        return response(req, res, -200, "상품 조회 실패", []);
                    }
                    if(result.length > 0)
                    {
                        let brandPK = []
                        for(let i = 0; i < result.length; i++) 
                        {
                            pk_list = JSON.parse(result[i].user_pk_list)
                            if(pk_list.indexOf(decode.code) != -1)
                                brandPK.push(result[i].pk);
                            else
                                continue
                        }

                        if(brandPK.length == 0)
                            response(req, req, res, 200, "소유한 상품이 없습니다.", []);
                        else
                        {
                            brandPK_json = JSON.stringify(brandPK)
                            brandPK_json = brandPK_json.replace("[","(")
                            brandPK_json = brandPK_json.replace("]",")")
                            let page = ((req.params.page || req.body.page) - 1) * 10;
                            let maxPage = 0;
                            let selectRows = "select TABLE_ROWS FROM information_schema.tables WHERE TABLE_NAME='item_information_tb'";
                            db.query(selectRows, (err, result) => {
                                maxPage = parseInt((result[0].TABLE_ROWS) / 10 + 0.9);
                                if(err)
                                {
                                    console.log(err)
                                    response(req, res, -200, "상품 조회 실패", []);
                                }
                                else
                                {
                                    let sql = ``
                                    let keyword = req.query.keyword
                                    if(keyword)
                                    {
                                        sql = `
                                        SELECT * FROM item_information_tb 
                                        WHERE item_num LIKE '%` + keyword + `%' 
                                        OR item_name LIKE '%` + keyword + `%' 
                                        OR middle_class LIKE '%` + keyword + `%' 
                                        OR status LIKE '%` + keyword + `%' 
                                        ORDER BY pk DESC LIMIT ` + page + `, 10`
                                    }
                                    else 
                                        sql = 'SELECT * FROM item_information_tb WHERE brand_pk IN '+ brandPK_json + ' ORDER BY pk DESC LIMIT ' + page + ', 10'
                                    db.query(sql, brandPK, (err, result, fields) => {
                                        if (err) {
                                            console.log(err)
                                            response(req, res, -200, "상품 조회 실패", [])
                                        } else {
                                            response(req, res, 200, "상품 조회 성공",{result, maxPage})
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//상품 수정
router.post('/updateitem', upload.fields([{name : 'mainImage'}, {name : 'detailImage'}, {name : 'qrImage'}]), (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 0)
        if(decode)
        {
            const pk = req.body.pk
            const brandPK = req.body.brandPk
            const itemNum = req.body.itemNum
            const itemName = req.body.itemName
            const classification = req.body.classification
            const middleClass = req.body.middleClass
            const status = req.body.status

            const {mainImage, detailImage, qrImage, isNull} = namingImagesPath("product", req.files)
            let query = 'UPDATE item_information_tb SET '
            let params = [brandPK, itemNum, itemName, classification, middleClass, status]
            let colNames = ['brand_pk', 'item_num', 'item_name', 'classification','middle_class','status']

            if(!isNull[0]) { params.push(mainImage); colNames.push('main_image') }
            if(!isNull[1]) { params.push(detailImage); colNames.push('detail_image') }
            if(!isNull[2]) { params.push(qrImage); colNames.push('qr_image') }
            let {sql, param} = getSQLnParams(query, params, colNames)

            param.push(pk)
            sql += ' WHERE pk=?'

            if(isNotNullOrUndefined(param))
            {
                db.query( sql, param, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "상품 수정 실패", [])
                    } else {
                        response(req, res, 200, "상품 수정 성공", [])
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})
//상품 삭제
router.post('/deleteitem', (req, res) => {
    try{
        const decode = checkLevel(req.cookies.token, 40)
        if(decode)
        {
            const pk = req.body.pk
            const param = [pk]
            if(isNotNullOrUndefined(param))
            {
                let sql = "DELETE FROM item_information_tb WHERE pk=?"
                db.query(sql, param, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "상품 삭제 실패", [])
                    } else {
                        response(req, res, 200, "상품 삭제 성공", [])
                    }
                })
            }
            else
            {
                nullResponse(req, res)
            }
        }
        else
            lowLevelResponse(req, res)
    }
    catch(err)
    {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
})

//-------------------------------------------------------키오스크api
router.post('/api', (req, res, next) => {
    if (req.body.api_key == "eMarts#&@(Dydgh)$!(!Inlite@Key") {
        if (req.body.api_code == 'WLK_010') {
            if (req.body.unique_code != undefined) {
                db.query('SELECT * FROM kiosk_information_tb WHERE unique_code=? order by pk desc limit 0,1', req.body.unique_code, (err, result) => {
                    if (err)
                        response(req, res, -200, err.message, [])
                    else
                        response(req, res, 100, "성공", result)
                })
            }
            else
                response(req, res, -100, "unique_code missed", [])
        }
        else if (req.body.api_code == 'WLK_020') {
            db.query('SELECT * FROM ad_information_tb order by pk desc limit 0,1', (err, result, fields) => {
                if (err)
                    response(req, res, -200, err.message, [])
                else
                    response(req, res, 100, "성공", result)
            })
        }
        else if (req.body.api_code == 'WLK_030') {
            db.query('SELECT * FROM brand_information_tb', (err, result, fields) => {
                if (err)
                    response(req, res, -200, err.message, [])
                else
                    response(req, res, 100, "성공", result)
            })
        }
        else if (req.body.api_code == 'WLK_040') {
            if (req.body.brand_pk != undefined) {
                let sql = ""
                let brand_pk = req.body.brand_pk
                if(req.body.brand_pk!=0)
                    sql = 'SELECT * FROM item_information_tb WHERE brand_pk=?'               
                else
                {
                    sql = 'SELECT * FROM item_information_tb WHERE classfication=?'
                    brand_pk = 1
                }
                db.query(sql, brand_pk, (err, result, fields) => {
                    if (err)
                        response(req, res, -200, err.message, [])
                    else
                        response(req, res, 100, "성공", result)
                })
            }
            else
                response(req, res, -100, "brand_pk missed", [])
        }
        else
            response(req, res, -100, "api_code missed", [])
    }
    else
        response(req, res, -100, "api_key missed", [])
})

module.exports = router;