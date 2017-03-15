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
        //authentication with username and password
        passport.authenticate(['local'], {session: false}, function (err, user) {
            if (err) {
                return util.handleFailResponse(res)(err);
            }
            if (!user) {
                return util.handleFailResponse(res)(new LoginFail());
            }
            //find watched event
            req.model.EventWatcherModel.find({watcher: user.username}, 'event_id', function(err, results){
                if (err) util.handleFailResponse(res)(err);
                logger.info(results);
                var watched_events = [];
                results.forEach(function (result) {
                    watched_events.push(result.toObject().event_id);
                });
                util.handleSuccessResponse(res)({
                    createdAt: user.createdAt,
                    username: user.username,
                    work_event: user.work_event,
                    watched_event: watched_events,
                    email: user.email,
                    token: {token: jwt.sign({id: user.username}, secret)}
                });
            });
        })(req, res, next);
    }).catch(function (err) {
        util.handleFailResponse(res)(err);
    })
};

module.exports = login;
