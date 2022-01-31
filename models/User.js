const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'] },
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    hash: String,
    salt: String
});

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash
}

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, process.env.ACCESS_TOKEN_SECRET);
};

UserSchema.methods.toAuthJSON = function () {
    return {
        email: this.email,
        name: this.name,
        token: this.generateJWT(),
    };
};

mongoose.model('User', UserSchema);