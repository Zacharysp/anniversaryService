/**
 * Created by dzhang on 3/13/17.
 */

const errors = require('../utilities').errors;
const util = require('../utilities').util;

const NoEventIdFound = errors.NoEventIdFound;
const NoEventFound = errors.NoEventFound;
const PermissionDenied = errors.PermissionDenied;

module.exports.owner = (req, res, next) => {
    let eventId = findEventId(req);
    if (!eventId) return util.handleFailResponse(res)(new NoEventIdFound());
    req.model.EventModel.findById(eventId).then((result) => {
        if (!result) throw new NoEventFound();
        if (result.owner != req.user.username) throw new PermissionDenied();
        next();
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

module.exports.worker = function(req, res, next) {
    let eventId = findEventId(req);
    if (!eventId) return util.handleFailResponse(res)(new NoEventIdFound());
    req.model.EventModel.findById(eventId).then((result) => {
        if (!result) throw new NoEventFound();
        if (result._doc.workers.indexOf(req.user.username) == -1) throw new PermissionDenied();
        next();
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

function findEventId(req) {
    if (req.method == 'POST') {
        return req.body.event_id;
    } else {
        return req.query.event_id;
    }
}
