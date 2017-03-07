/**
 * Created by dzhang on 3/7/17.
 */

var util = require('../../utilities').util;
var Joi = require('joi');

var addWorker = function (req, res) {
    // JOI validation
    var joiSchema = Joi.object().keys({
        title: Joi.string().max(50).required()
    });
    util.validatePromise(req.body, joiSchema).then(function(result){
        result.owner = req.authInfo;
        result.status = 0;
        var event = new req.model.EventModel(result);
        return event.save()
    }).then(function(result){
        logger.info(result._doc);
        var eventWorker = new req.model.EventWorkerModel({
            event_id: result._doc._id,
            worker: req.authInfo
        });
        return eventWorker.save();
    }).then(function(){
        util.handleSuccessResponse(res)();
    }).catch(function(err){
        return util.handleFailResponse(res)(err);
    });
};

module.exports = addWorker;