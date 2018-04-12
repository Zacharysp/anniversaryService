/**
 * Created by Zachary on 3/11/17.
 */

const util = require('../../utilities/index').util;
const errors = require('../../utilities/index').errors;
const Joi = require('joi');

const AlreadyWork = errors.AlreadyWork;
const PermissionDenied = errors.PermissionDenied;
const NoEventFound = errors.NoEventFound;

let addWorker = (req, res) => {
    // JOI validation
    const joiSchema = Joi.object().keys({
        event_id: Joi.string().length(24).required(),
        workers: Joi.array().items(Joi.string()).required()
    });
    util.validatePromise(req.body, joiSchema).then((result) => {
        return req.model.EventModel.findById(result.event_id);
    }).then((result) => {
        if (!result) throw new NoEventFound();
        if (result.owner != req.user.username) throw new PermissionDenied();
        if (result._doc.workers.indexOf(req.body.worker) != -1) throw new AlreadyWork();
        result._doc.workers.push(req.body.workers);
        return result.save();
    }).then(() => {
        return updateWorker(req);
    }).then(() => {
        util.handleSuccessResponse(res)();
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

function updateWorker(req) {
    let bulkOps = [];
    req.body.workers.forEach((worker) => {
        bulkOps.push({
            updateOne: {
                filter: {username: worker},
                update: {$push: {work_event: req.body.event_id}}
            }
        });
    });
    return req.model.UserModel.bulkWrite(bulkOps, {'ordered': false, 'w': 1});
}

module.exports = addWorker;
