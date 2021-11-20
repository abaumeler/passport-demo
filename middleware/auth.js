const jwt = require('express-jwt');
const env = require('dotenv').config();

function getTokenFromHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
}

var auth = {
    required: jwt({
        secret: process.env.ACCESS_TOKEN_SECRET,
        userProperty: 'payload',
        algorithms: ['sha1', 'RS256', 'HS256'],
        getToken: getTokenFromHeader
    }),
    optional: jwt({
        secret: process.env.ACCESS_TOKEN_SECRET,
        userProperty: 'payload',
        credentialsRequired: false,
        algorithms: ['sha1', 'RS256', 'HS256'],
        getToken: getTokenFromHeader
    })
};

module.exports = auth;