/**
 * Created by Zachary on 3/1/17.
 */

var util = require('../../utilities').util;
var Joi = require('joi');

var create = function (req, res) {

    var User = req.model.UserModel;
    // JOI validation
    var joiSchema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string().regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/).min(8).max(20).required(),
        email: Joi.string().email().optional()
    });
    util.validatePromise(req.body, joiSchema).then(function(result){
        var user = new User(result);
        return user.save()
    }).then(function(){
        util.handleSuccessResponse(res)();
    }).catch(function(err){
        return util.handleFailResponse(res)(err);
    });
};

module.exports = create;
