/**
 * Created by dzhang on 2/27/17.
 */
"use strict";
var router = require('express').Router();
var Joi = require('joi');
var util = require('../utilities').util;

var User = require('../models/user');

router.post('/register', function (req, res) {
    // JOI validation
    var joiSchema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).min(8).max(20).required(),
        email: Joi.string().email().optional()
    });
    util.validatePromise(req.body, joiSchema).then(function(result){
        var user = new User(result);
        return user.save()
    }).then(function(){
        util.handleSuccessResponse(res)();
    }).catch(function(err){
        return util.handleFailResponse(res)(err);
    });
});

module.exports = router;