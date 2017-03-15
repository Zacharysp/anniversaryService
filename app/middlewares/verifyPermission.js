/**
 * Created by dzhang on 3/13/17.
 */

var errors = require('../utilities').errors;
var util = require('../utilities').util;

var NoEventIdFound = errors.NoEventIdFound;
var NoEventFound = errors.NoEventFound;
var PermissionDenied = errors.PermissionDenied;

module.exports.owner = function(req, res, next) {
    var event_id = findEventId(req);
    if(!event_id) return util.handleFailResponse(res)(new NoEventIdFound());
    req.model.EventModel.findById(event_id).then(function (result) {
        if (!result) throw new NoEventFound();
        if (result.owner != req.user.username) throw new PermissionDenied();
        next()
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports.worker = function(req, res, next) {
    var event_id = findEventId(req);
    if(!event_id) return util.handleFailResponse(res)(new NoEventIdFound());
    req.model.EventModel.findById(event_id).then(function (result) {
        if (!result) throw new NoEventFound();
        if (result._doc.workers.indexOf(req.user.username) == -1) throw new PermissionDenied();
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