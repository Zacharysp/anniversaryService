/**
 * Created by dzhang on 2/6/17.
 */
global.logger = require('./logger');

const ServerError = require('./error').ServerError;
const Promise = require('bluebird');
const Joi = require('joi');
const joiValidate = Promise.promisify(Joi.validate);
/**
 * handle fail response
 * @param res
 * @returns {Function}
 */
exports.handleFailResponse = (res) => {
    return (err) => {
        if (err.name == null) {
            err = new ServerError();
        }
        logger.error(err);
        switch (err.name) {
            // handle validation error response
            case 'ValidationError':
            case 'MongoError':
                res.status(400).send(handleResponse(301, displayValidationError(err)));
                break;
            // handle database error response
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
            // handle bad request error response
            default:
                logger.info(err.name);
                res.status(400).send(handleResponse(err.code, err.message));
                break;
        }
    };
};

/**
 * handle success response
 * @param res
 * @returns {Function}
 */
exports.handleSuccessResponse = (res) => {
    return (result) => {
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
const handleResponse = (code, msg, data) => {
    return {
        data: data,
        status: {
            code: code,
            msg: msg
        }
    };
};

/**
 * construct validation error message to one line
 * @param err
 * @returns {string}
 */
const displayValidationError = (err) => {
    let msgs = [];
    if (err.isJoi) {
        // joi error
        logger.info('joi');
        err.details.forEach((data) => {
            msgs.push(data.message);
        });
    } else if (err.errors) {
        // mongoose errors
        logger.info('mongoose');
        for (let key in err.errors) {
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
};

exports.validatePromise = (validateObj, schemaObj, options) => {
    /**
     * Joi validation
     */
    if (!options) options = {};
    options.abortEarly = false;
    return joiValidate(validateObj, schemaObj, options);
};
