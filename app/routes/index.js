/**
 * Created by dzhang on 2/9/17.
 */
"use strict";
var router = require('express').Router();

router.use('/user', require('./user'));
router.use('/event', require('./event'));
router.use('/moment', require('./moment'));

module.exports = router;
