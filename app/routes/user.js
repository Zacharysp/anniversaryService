/**
 * Created by dzhang on 2/27/17.
 */
"use strict";
var router = require('express').Router();
var util = require('../utilities').util;

var User = require('../models/user');

router.post('/register', function (req, res) {

    var user = new User({
        username: req.body.username,
        password: req.body.password
    });

    logger.info(user.username);
    logger.info(user.password);

    // user.validate(function (err) {
    //     if (err) return util.handleFailResponse(res)(err);
        user.save(function (err) {
            if (err) {
                logger.info(err.code);
                logger.info(err.message);
                logger.info(err);
                return util.handleFailResponse(res)(err);
            }
            util.handleSuccessResponse(res);
        });
    // });


});

module.exports = router;