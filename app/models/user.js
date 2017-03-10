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
        required: [true, 'Missing username'],
        index: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: [true, 'Missing password']
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


UserSchema.index({ username: 1 });

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

/**
 * verify username is unique
 */
UserSchema.path('username').validate(function(username, callback){
    if (this.isNew || this.isModified('username')) {
        var User = mongoose.model('User');
        User.find({ username: username }).exec(function (err, users){
            callback(!err && users.length == 0)
        })
    }else {
        callback(true)
    }
}, 'username already existed');

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

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;