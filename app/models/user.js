/**
 * Created by dzhang on 2/28/17.
 */
"use strict";
var mongoose = require('mongoose');
var crypto = require('crypto');
var CreateUpdatedAt = require('mongoose-timestamp');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: [true, "username must be unique"]
    },
    hashed_password: {
        type: String
    },
    salt: {
        type: String
    },
    email: {
        type: String,
        required: false,
        lowercase: true
    }
});

UserSchema.plugin(CreateUpdatedAt);


/**
 * Virtuals
 */
UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () { return this._password });


// UserSchema.path('username').validate(function (username) {
//     return username.length
// }, 'Username cannot be blank');
//
// UserSchema.path('username').validate(function (username) {
//
//     logger.info('in validate');
//     // Check only when it is a new user or when email field is modified
//     if (this.isNew || this.isModified('username')) {
//         User.find({ username: username }).exec(function (err, users) {
//             return !err && users.length === 0
//         })
//     } else return true
// }, 'Username already exists');

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return ''
        }
    }
};

var UserModel = mongoose.model('UserModel', UserSchema);

UserModel.schema.path('username').validate(function (username) {
    return username.length
}, 'Username cannot be blank', 'Missing username');



module.exports = UserModel;