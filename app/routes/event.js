/**
 * Created by Zachary on 3/6/17.
 */
const express = require('express');
const router = new express.Router();
const eventCtrl = require('../controllers/events');
const authenticate = require('../middlewares').auth;

router.use(authenticate);

router.post('/new', eventCtrl.create);

router.post('/watch', eventCtrl.watch);

router.post('/add', eventCtrl.addWorker);

router.get('/watchers', eventCtrl.findAllWatchers);

router.get('/', eventCtrl.findAll);

module.exports = router;
