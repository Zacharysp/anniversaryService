/**
 * Created by Zachary on 3/6/17.
 */

const util = require('../../utilities').util;
const Joi = require('joi');

let create = (req, res) => {
    // JOI validation
    const joiSchema = Joi.object().keys({
        title: Joi.string().max(50).required(),
        from: Joi.date().min('1-1-1900').max(Date()).default(Date())
    });
    util.validatePromise(req.body, joiSchema).then((result) => {
        result.owner = req.user.username;
        result.status = 0;
        result.workers = [req.user.username];
        let event = new req.model.EventModel(result);
        return event.save();
    }).then((event) => {
        return req.model.UserModel.
        findOneAndUpdate({username: req.user.username}, {$push: {work_event: event._doc._id}});
    }).then(() => {
        util.handleSuccessResponse(res)();
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = create;
