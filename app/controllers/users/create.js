/**
 * Created by Zachary on 3/1/17.
 */

const util = require('../../utilities').util;
const Joi = require('joi');

let create = (req, res) => {
    // JOI validation
    const joiSchema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).min(8).max(20).required(),
        email: Joi.string().email().optional()
    });
    util.validatePromise(req.body, joiSchema).then((result) => {
        let user = new req.model.UserModel(result);
        return user.save();
    }).then(() => {
        util.handleSuccessResponse(res)();
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = create;
