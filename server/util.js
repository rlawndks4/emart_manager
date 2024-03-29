//const { request } = require('express')
const jwt = require('jsonwebtoken')
const db = require('./config/db')

let checkLevel = (token, level) => {
    try{
        if(token == undefined)
            return false

        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
            if(err) {
                console.log("token이 변조되었습니다." + err);
                return false
            }
            else return decoded;
        })
        const user_level = decoded.user_level
        
        if(level > user_level)
            return false
        else
            return decoded
    }
    catch(err)
    {
        console.log(err)
        return false
    }
}

const lowLevelException = {
    code: 403,
    message: "권한이 없습니다."
}
const nullRequestParamsOrBody = {
    code: 400,
    message: "입력이 잘못되었습니다.(요청 데이터 확인)"
}

const logRequestResponse = (req, res) => {
    const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip
    let request = {
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        params: req.params, 
        body: req.body
    }
    request = JSON.stringify(request)
    let response = JSON.stringify(res)
    // console.log(request)
    // console.log(response)

    db.query(
        "INSERT INTO log_information_tb (request, response, request_ip) VALUES (?, ?, ?)",
        [request, response, requestIp],
        (err, result, fields) => {
            if(err)
                console.log(err)
            else {
                //console.log(result)
            }
        }
    )
}
const logRequest = (req) => {
    const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip
    let request = {
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        params: req.params, 
        body: req.body
    }
    request = JSON.stringify(request)
    db.query(
        "INSERT INTO log_information_tb (request, request_ip) VALUES (?, ?)",
        [request, requestIp],
        (err, result, fields) => {
            if(err)
                console.log(err)
            else {
                console.log(result)
            }
        }
    )
}
const logResponse = (req, res) => {
    const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip
    let response = JSON.stringify(res)
    // db.query(
    //     "UPDATE log_information_tb SET response=? WHERE request_ip=? ORDER BY pk DESC LIMIT 1",
    //     [response, requestIp],
    //     (err, result, fields) => {
    //         if(err)
    //             console.log(err)
    //         else {
    //             console.log(result)
    //         }
    //     }
    // )
}

/*

*/
const getUserPKArrStrWithNewPK = (userPKArrStr, newPK) => {
    let userPKList = JSON.parse(userPKArrStr)
    if(userPKList.indexOf(newPK) == -1)
        userPKList.push(newPK)
    return JSON.stringify(userPKList)
}

const isNotNullOrUndefined = (paramList) => {
    for(let i in paramList)
        if(i == undefined || i == null)
            return false
    return true
}

// api가 ad인지 product인지 확인 후 파일 네이밍
const namingImagesPath = (api, files) => {
    if(api == "ad")
    {
        return { 
            image: (files) ? "/image/ad/" + files.filename : "/image/ad/defaultAd.png", 
            isNull: !(files) 
        }
    }
    else if(api == "product")
    {
        return {
            mainImage: (files.mainImage) ? "/image/item/" + files.mainImage[0].filename : "/image/item/defaultItem.png",
            detailImage: (files.detailImage) ? "/image/detailItem/" + files.detailImage[0].filename : "/image/detailItem/defaultDetail.png",
            qrImage: (files.qrImage) ? "/image/qr/" + files.qrImage[0].filename : "/image/qr/defaultQR.png",
            isNull: [!files.mainImage, !files.detailImage, !files.qrImage]
        }
    }
}

function getSQLnParams(query, params, colNames) {
    let sql = query
    let returnParams = []

    for(let i = 0, count = 0; i < params.length; i++)
    {
        if(params[i])
        {
            if(count > 0)
                sql+=', '
            sql += colNames[i] + '=?'
            returnParams.push(params[i])
            count++
        }
    }
    return {sql, param: returnParams}
}

function response(req, res, code, message, data) {
    var resDict = {
        'result': code,
        'message': message,
        'data': data,
    }
    logRequestResponse(req, resDict)
    res.send(resDict)
}
function nullResponse(req, res)
{
    response(req, res, -200, "입력이 잘못되었습니다.(요청 데이터 확인)", [])
}
function lowLevelResponse(req, res)
{
    response(req, res, -200, "권한이 없습니다", [])
}

module.exports = {
    checkLevel, lowLevelException, nullRequestParamsOrBody,
    logRequestResponse, logResponse, logRequest,
    getUserPKArrStrWithNewPK, isNotNullOrUndefined, 
    namingImagesPath, getSQLnParams,
    nullResponse, lowLevelResponse, response
}