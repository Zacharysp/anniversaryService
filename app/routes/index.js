/**
 * Created by dzhang on 2/9/17.
 */
"use strict";
var router = require('express').Router();

router.use('/', require('./user'));

module.exports = router;
