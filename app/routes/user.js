/**
 * Created by dzhang on 2/27/17.
 */
"use strict";
var router = require('express').Router();
var userCtrl = require('../controllers/users');
var authenticate = require('../middlewares').auth;

router.post('/register', userCtrl.create);

router.post('/login', userCtrl.login);

router.get('/', authenticate, function(req, res){
    res.send(req.authInfo);
});

module.exports = router;