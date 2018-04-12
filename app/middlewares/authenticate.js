/**
 * Created by Zachary on 3/4/17.
 */
const passport = require('passport');
const errors = require('../utilities').errors;
const util = require('../utilities').util;

const UnauthorizedError = errors.UnauthorizedError;

module.exports = (req, res, next) => {
    return passport.authenticate('bearer', {session: false}, (err, user) => {
        if (err) {
            return util.handleFailResponse(res)(err);
        }
        if (!user) {
            return util.handleFailResponse(res)(new UnauthorizedError());
        }
        req.user = user;
        return next();
    })(req, res, next);
};
