/**
 * Created by dzhang on 2/27/17.
 */
const express = require('express');
const router = new express.Router();
const userCtrl = require('../controllers/users');
const authenticate = require('../middlewares').auth;

router.post('/register', userCtrl.create);

router.post('/login', userCtrl.login);

router.use(authenticate);

router.post('/avatar/upload', userCtrl.uploadAvatar);

router.get('/avatar', userCtrl.findAvatar);

router.get('/', userCtrl.info);

module.exports = router;
