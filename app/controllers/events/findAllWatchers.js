/**
 * Created by Zachary on 3/11/17.
 */

var util = require('../../utilities/index').util;
var errors = require('../../utilities/index').errors;
var Joi = require('joi');

var NoEventFound = errors.NoEventFound;

var perPage = 100;

var findAllWatchers = function (req, res) {
    // JOI validation
    var joiSchema = Joi.object().keys({
        event_id: Joi.string().length(24).required(),
        page: Joi.number()
    });
    util.validatePromise(req.query, joiSchema).then(function (result) {
        return req.model.EventModel.findById(result.event_id)
    }).then(function (result) {
        if (!result) throw new NoEventFound();
        var page = req.query.page || 0;
        return req.model.EventWatcherModel
            .find({"event_id": req.query.event_id})
            .select('watcher')
            .limit(perPage)
            .skip(perPage * page)
    }).then(function (result) {
        util.handleSuccessResponse(res)(result.map(function(value){
            return value.watcher;
        }));
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = findAllWatchers;