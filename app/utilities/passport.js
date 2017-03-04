/**
 * Created by Zachary on 3/4/17.
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var errors = require('../utilities').errors;

var UnauthorizedError = errors.UnauthorizedError;

var User = require('../models/index').UserModel;

var jwt = require('jsonwebtoken');
var config = require('config');
var secret = config.get('secret');

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err)  return done(err);
        if (!user)  return done(null, false);
        if (!user.authenticate(password)) return done(null, false);
        return done(null, user);
    });
}));

passport.use(new BearerStrategy(function (token, done) {
    jwt.verify(token, secret, function (err, decoded) {
        if (err) return done(new UnauthorizedError());
        return done(null, decoded ? decoded.id : false);
    });
}));