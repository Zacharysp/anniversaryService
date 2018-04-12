/**
 * Created by Zachary on 3/12/17.
 */
const express = require('express');
const router = new express.Router();
const momentCtrl = require('../controllers/moments');
const authenticate = require('../middlewares').auth;

router.use(authenticate);

router.post('/new', momentCtrl.create);

module.exports = router;

