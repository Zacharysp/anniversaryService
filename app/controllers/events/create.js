/**
 * Created by Zachary on 3/6/17.
 */

var util = require('../../utilities').util;
var Joi = require('joi');

var create = function (req, res) {
    // JOI validation
    var joiSchema = Joi.object().keys({
        title: Joi.string().max(50).required()
    });
    util.validatePromise(req.body, joiSchema).then(function (result) {
        result.owner = req.user.username;
        result.status = 0;
        result.workers = [req.user.username];
        var event = new req.model.EventModel(result);
        return event.save()
    }).then(function (event) {
        return req.model.UserModel.findOneAndUpdate({username: req.user.username}, {$push: {work_event: event._doc._id}});
    }).then(function () {
        util.handleSuccessResponse(res)();
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = create;
