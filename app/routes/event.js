/**
 * Created by Zachary on 3/6/17.
 */
"use strict";
var router = require('express').Router();
var eventCtrl = require('../controllers/events');
var authenticate = require('../middlewares').auth;

router.post('/new', authenticate, eventCtrl.create);

router.post('/watch', authenticate, eventCtrl.watch);

module.exports = router;