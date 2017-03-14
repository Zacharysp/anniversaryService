/**
 * Created by dzhang on 3/7/17.
 */

var util = require('../../utilities/index').util;
var errors = require('../../utilities/index').errors;
var Joi = require('joi');

var AlreadyWatch = errors.AlreadyWatch;

var watch = function (req, res) {
    // JOI validation
    var joiSchema = Joi.object().keys({
        event_id: Joi.string().length(24).required()
    });
    util.validatePromise(req.body, joiSchema).then(function (result) {
        return req.model.EventWatcherModel.findOne({'event_id': result.event_id, 'watcher': req.user.username})
    }).then(function (result) {
        if (result) throw new AlreadyWatch();
        var eventWatcher = new req.model.EventWatcherModel({
            event_id: req.body.event_id,
            watcher: req.user.username
        });
        return eventWatcher.save();
    }).then(function () {
        util.handleSuccessResponse(res)();
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = watch;