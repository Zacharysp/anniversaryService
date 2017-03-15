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
        workers: Joi.array().items(Joi.string()).required()
    });
    util.validatePromise(req.body, joiSchema).then(function (result) {
        return req.model.EventModel.findById(result.event_id)
    }).then(function (result) {
        if (!result) throw new NoEventFound();
        if (result.owner != req.user.username) throw new PermissionDenied();
        if (result._doc.workers.indexOf(req.body.worker) != -1) throw new AlreadyWork();
        result._doc.workers.push(req.body.workers);
        return result.save();
    }).then(function () {
        return updateWorker(req);
    }).then(function () {
        util.handleSuccessResponse(res)();
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

function updateWorker(req) {
    var bulkOps = [];
    req.body.workers.forEach(function (worker) {
        bulkOps.push({
            updateOne: {
                filter: {username: worker},
                update: {$push: {work_event: req.body.event_id}}
            }
        });
    });
    return req.model.UserModel.bulkWrite(bulkOps, {"ordered": false, w: 1});
}

module.exports = addWorker;