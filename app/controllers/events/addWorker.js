/**
 * Created by Zachary on 3/11/17.
 */

var util = require('../../utilities/index').util;
var errors = require('../../utilities/index').errors;
var Joi = require('joi');

var AlreadyWork = errors.AlreadyWork;
var PermissionDenied = errors.PermissionDenied;
var NoEventFound = errors.NoEventFound;

var addWorker = function (req, res) {
    // JOI validation
    var joiSchema = Joi.object().keys({
        event_id: Joi.string().length(24).required(),
        worker: Joi.string().required()
    });
    util.validatePromise(req.body, joiSchema).then(function (result) {
        return req.model.EventModel.findById(result.event_id)
    }).then(function (result) {
        if (!result) throw new NoEventFound();
        if (result.owner != req.authInfo) throw new PermissionDenied();
        if (result._doc.workers.indexOf(req.body.worker) != -1) throw new AlreadyWork();
        result._doc.workers.push(req.body.worker);
        return result.save();
    }).then(function () {
        util.handleSuccessResponse(res)();
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = addWorker;