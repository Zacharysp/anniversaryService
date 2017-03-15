/**
 * Created by dzhang on 2/27/17.
 */
"use strict";
var router = require('express').Router();
var userCtrl = require('../controllers/users');
var authenticate = require('../middlewares').auth;

router.post('/register', userCtrl.create);

router.post('/login', userCtrl.login);

router.use(authenticate);

router.post('/avatar/upload', userCtrl.uploadAvatar);

router.get('/avatar', userCtrl.findAvatar);

router.get('/', userCtrl.info);

module.exports = router;