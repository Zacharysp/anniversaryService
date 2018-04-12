/**
 * Created by dzhang on 2/13/17.
 */
const util = require('util');

const definedErrors = [
    {
        className: 'UnauthorizedError',
        message: 'unauthorized',
        code: '0101'
    }, {
        className: 'ServerError',
        message: 'server error',
        publicMessage: 'server error',
        code: '0201'
    }, {
        className: 'BadRequest',
        message: 'bad request',
        code: '0301'
    }, {
        className: 'LoginFail',
        message: 'Wrong combination of username and password',
        code: '0102'
    }, {
        className: 'AlreadyWatch',
        message: 'You are already watching this event',
        code: '0501'
    }, {
        className: 'AlreadyWork',
        message: 'Already work on this event',
        code: '0502'
    }, {
        className: 'PermissionDenied',
        message: 'You don\'t have permisson',
        code: '0102'
    }, {
        className: 'NoEventFound',
        message: 'No event found',
        code: '0503'
    }, {
        className: 'NoEventIdFound',
        message: 'No event_id found in request',
        code: '0504'
    }, {
        className: 'NoImageIdFound',
        message: 'No image found',
        code: '0505'
    }
];

for (let i = 0; i < definedErrors.length; i++) {
    let className = definedErrors[i].className;
    let fn = initError(definedErrors[i]);
    util.inherits(fn, Error);
    module.exports[className] = fn;
}

function initError(error) {
    return function fn() {
        this.message = error.message;
        this.name = error.className;
        this.code = error.code;
        Error.captureStackTrace(this, fn);
    };
}
