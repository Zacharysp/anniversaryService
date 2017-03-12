/**
 * Created by Zachary on 3/12/17.
 */

"use strict";
var router = require('express').Router();
var momentCtrl = require('../controllers/moments');
var authenticate = require('../middlewares').auth;

router.use(authenticate);

router.post('/new', momentCtrl.create);

module.exports = router;

