/**
 * Created by Zachary on 3/6/17.
 */
"use strict";
var router = require('express').Router();
var eventCtrl = require('../controllers/events');
var authenticate = require('../middlewares').auth;

router.use(authenticate);

router.post('/new', eventCtrl.create);

router.post('/watch', eventCtrl.watch);

router.post('/add', eventCtrl.addWorker);

router.get('/watchers', eventCtrl.findAllWatchers);

module.exports = router;