const mysql = require('mysql')

const db = mysql.createConnection({
    host : "inlightek3.cafe24app.com",
    user : 'inlightek3',
    password : 'qjfwk100djr!',
    port : 3306,
    database:'inlightek3'
})
db.connect();

module.exports = db;