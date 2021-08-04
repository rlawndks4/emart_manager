const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const salt = process.env.salt
// const { User } = require('../models');

var isEmpty = function (value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'pw',
    }, async (id, pw, done) => {
        try {
            db.query('SELECT * FROM user_information_tb WHERE id=?', [id], (err, result) => {
                if (result.length>0) {
                    bcrypt.hash(pw, salt, (error, hash) => {
                        console.log("salt : " + salt );
                        if(hash === result[0].pw)
                            done(null, result[0]);
                        else
                            done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    });
                }
                else {
                    done(null, false, { message: '가입되지 않은 회원입니다.' });
                }
            });
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};