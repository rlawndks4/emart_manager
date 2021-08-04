const { request } = require('express')
const jwt = require('jsonwebtoken')
const db = require('./config/db')

let checkLevel = (token, level) => {
    if(token == undefined)
        return false

    const data = jwt.decode(token)//need secret , process.env.JWT_SECRET)
    const user_level = data.user_level
    if(level > user_level)
        return false
    else
        return data
}

const lowLevelException = {
    code: 403,
    message: "권한이 없습니다."
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
     console.log(request)
     console.log(response)
    
    db.query(
        "INSERT INTO log_information_tb (request, response, request_ip) VALUES (?, ?, ?)",
        [request, response, requestIp],
        (err, result, fields) => {
            if(err)
                console.log(err)
            else {
                console.log(result)
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
    //     "UPDATE log_information_tb SET response=? WHERE request_ip=?",
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
module.exports = {checkLevel, lowLevelException, logRequestResponse, logResponse, logRequest}