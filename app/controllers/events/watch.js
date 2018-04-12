/**
 * Created by dzhang on 3/7/17.
 */

const util = require('../../utilities/index').util;
const errors = require('../../utilities/index').errors;
const Joi = require('joi');

const AlreadyWatch = errors.AlreadyWatch;

let watch = (req, res) => {
    // JOI validation
    const joiSchema = Joi.object().keys({
        event_id: Joi.string().length(24).required()
    });
    util.validatePromise(req.body, joiSchema).then((result) => {
        return req.model.EventWatcherModel.findOne({'event_id': result.event_id, 'watcher': req.user.username});
    }).then((result) =>{
        if (result) throw new AlreadyWatch();
        let eventWatcher = new req.model.EventWatcherModel({
            event_id: req.body.event_id,
            watcher: req.user.username
        });
        return eventWatcher.save();
    }).then(() => {
        util.handleSuccessResponse(res)();
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = watch;
