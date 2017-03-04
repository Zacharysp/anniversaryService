/**
 * Created by Zachary on 3/4/17.
 */
var passport = require('passport');
var errors = require('../utilities').errors;
var util = require('../utilities').util;

var UnauthorizedError = errors.UnauthorizedError;


module.exports = function(req, res, next) {
    return passport.authenticate('bearer', {session: false}, function (err, authInfo) {
        if (err) {
            return util.handleFailResponse(res)(err);
        }
        if (!authInfo) {
            return util.handleFailResponse(res)(new UnauthorizedError());
        }
        req.authInfo = authInfo;
        return next();
    })(req, res, next);
};