/**
 * Created by dzhang on 2/6/17.
 */
"use strict";

global.logger = require('./logger');

var http = require('http');
var https = require('https');
var config = require('config');
var authConfig = config.has('authConfig') ? config.get('authConfig') : {};

var ServerError = require('./error').ServerError;

var Promise = require('bluebird');
var Joi = require('joi');
var joiValidate = Promise.promisify(Joi.validate);
/**
 * handle fail response
 * @param res
 * @returns {Function}
 */
exports.handleFailResponse = function (res) {
    return function (err) {
        if (err.name == null) {
            err = new ServerError();
        }
        logger.error(err);
        switch (err.name) {
            //handle validation error response
            case 'ValidationError':
            case 'MongoError':
                res.status(400).send(handleResponse(301, displayValidationError(err)));
                break;
            //handle database error response
            case 'UnauthorizedError':
                res.status(401).send(handleResponse(err.code, err.message));
                break;
            case 'DBError':
            case 'ServerError':
                if (process.env.NODE_ENV == 'development') {
                    res.status(500).send(handleResponse(err.code, err.message));
                } else {
                    res.status(500).send(handleResponse(err.code, err.publicMessage));
                }
                break;
            //handle bad request error response
            default:
                logger.info(err.name);
                res.status(400).send(handleResponse(err.code, err.message));
                break;
        }
    }
};

/**
 * handle success response
 * @param res
 * @returns {Function}
 */
exports.handleSuccessResponse = function (res) {
    return function (result) {
        res.send(handleResponse(0, 'success', result));
    };
};

/**
 * handle response with data returned
 * @param code
 * @param msg
 * @param data
 * @returns {{data: *, status: {code: *, msg: *}}}
 */
function handleResponse(code, msg, data) {
    return {
        data: data,
        status: {
            code: code,
            msg: msg
        }
    }
}

/**
 * construct validation error message to one line
 * @param err
 * @returns {string}
 */
function displayValidationError(err) {
    var msgs = [];
    if (err.isJoi) {
        //joi error
        logger.info('joi');
        err.details.forEach(function (data) {
            msgs.push(data.message);
        });
    } else if (err.errors) {
        //mongoose errors
        logger.info('mongoose');
        for (var key in err.errors) {
            if (err.errors.hasOwnProperty(key)) {
                msgs.push(err.errors[key].message);
            }
        }
    } else if (11000 === err.code || 11001 === err.code) {
        msgs.push('Duplicate found');
    } else {
        msgs.push(err.message);
    }
    return msgs.join(', ');
}

exports.validatePromise = function (validateObj, schemaObj, options) {
    /**
     * Joi validation
     */
    if (!options) options = {};
    options.abortEarly = false;
    return joiValidate(validateObj, schemaObj, options)
};