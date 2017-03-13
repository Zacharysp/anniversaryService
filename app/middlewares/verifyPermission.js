/**
 * Created by dzhang on 3/13/17.
 */

var errors = require('../utilities').errors;
var util = require('../utilities').util;

var NoEventIdFound = errors.NoEventIdFound;
var NoEventFound = errors.NoEventFound;
var PermissionDenied = errors.PermissionDenied;

module.exports.ownerPermission = function(req, res, next) {
    var event_id = findEventId(req);
    if(!event_id) return util.handleFailResponse(res)(new NoEventIdFound());
    req.model.EventModel.findById(event_id).then(function (result) {
        if (!result) throw new NoEventFound();
        if (result.owner != req.authInfo) throw new PermissionDenied();
        next()
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports.workerPermission = function(req, res, next) {
    var event_id = findEventId(req);
    if(!event_id) return util.handleFailResponse(res)(new NoEventIdFound());
    req.model.EventModel.findById(event_id).then(function (result) {
        if (!result) throw new NoEventFound();
        if (result._doc.workers.indexOf(req.authInfo) == -1) throw new PermissionDenied();
        next()
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

function findEventId(req) {
    if (req.method == 'POST') {
        return req.body.event_id;
    }else {
        return req.query.event_id;
    }
}