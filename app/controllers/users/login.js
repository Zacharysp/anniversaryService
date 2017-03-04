/**
 * Created by Zachary on 3/4/17.
 */

var Joi = require('joi');
var util = require('../../utilities').util;
var errors = require('../../utilities').errors;
var passport = require('passport');

var jwt = require('jsonwebtoken');
var config = require('config');
var secret = config.get('secret');

var LoginFail = errors.LoginFail;

var login = function (req, res, next) {
    var joiSchema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    util.validatePromise(req.body, joiSchema).then(function () {
        passport.authenticate(['local'], {session: false}, function (err, user) {
            if (err) {
                return util.handleFailResponse(res)(err);
            }
            if (!user) {
                return util.handleFailResponse(res)(new LoginFail());
            }
            util.handleSuccessResponse(res)({token: jwt.sign({id: user.username}, secret)});
        })(req, res, next);
    }).catch(function (err) {
        util.handleFailResponse(res)(err);
    })
};

module.exports = login;
