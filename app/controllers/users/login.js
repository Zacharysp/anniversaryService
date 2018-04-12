/**
 * Created by Zachary on 3/4/17.
 */

const Joi = require('joi');
const util = require('../../utilities').util;
const errors = require('../../utilities').errors;
const passport = require('passport');

const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');

const LoginFail = errors.LoginFail;

let login = (req, res, next) => {
    const joiSchema = Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    util.validatePromise(req.body, joiSchema).then(() => {
        // authentication with username and password
        passport.authenticate(['local'], {session: false}, (err, user) => {
            if (err) {
                return util.handleFailResponse(res)(err);
            }
            if (!user) {
                return util.handleFailResponse(res)(new LoginFail());
            }
            // find watched event
            req.model.EventWatcherModel.find({watcher: user.username}, 'event_id', (err, results) => {
                if (err) util.handleFailResponse(res)(err);
                logger.info(results);
                let watchedEvents = [];
                results.forEach((result) => {
                    watchedEvents.push(result.toObject().event_id);
                });
                util.handleSuccessResponse(res)({
                    createdAt: user.createdAt,
                    username: user.username,
                    work_event: user.work_event,
                    watched_event: watchedEvents,
                    email: user.email,
                    token: {token: jwt.sign({id: user.username}, secret)}
                });
            });
        })(req, res, next);
    }).catch((err) => {
        util.handleFailResponse(res)(err);
    });
};

module.exports = login;
