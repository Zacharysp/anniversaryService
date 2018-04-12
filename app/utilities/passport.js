/**
 * Created by Zachary on 3/4/17.
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const User = require('../models/index').UserModel;

const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('secret');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({username: username}, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        if (!user.authenticate(password)) return done(null, false);
        return done(null, user);
    });
}));

passport.use(new BearerStrategy((token, done) => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return done(err);
        if (!decoded) return done(null, false);
        User.findOne({username: decoded.id}, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            return done(null, user);
        });
    });
}));
