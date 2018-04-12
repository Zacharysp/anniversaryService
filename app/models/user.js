/**
 * Created by dzhang on 2/28/17.
 */
const mongoose = require('mongoose');
const crypto = require('crypto');
const CreateUpdatedAt = require('mongoose-timestamp');
const ObjectId = mongoose.Schema.ObjectId;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    email: {
        type: String,
        required: false,
        lowercase: true
    },
    work_event: [
        {
            type: ObjectId,
            ref: 'Event'
        }
    ],
    avatar: {
        type: String
    }
});

UserSchema.plugin(CreateUpdatedAt);


UserSchema.index({username: 1});

/**
 * Virtuals
 */
UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    }
};

let UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
