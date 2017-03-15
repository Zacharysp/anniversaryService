/**
 * Created by dzhang on 3/28/17.
 */

var util = require('../../utilities').util;
var Promise = require('bluebird');

var findAll = function (req, res) {
    var promiseArray = [];
    req.user.work_event.forEach(function(eventId){
        promiseArray.push(req.model.EventModel.findById(eventId, '_id title cover from owner status workers moments'));
    });
    Promise.all(promiseArray).then(function (results) {
        util.handleSuccessResponse(res)(results);
    }).catch(function (err) {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = findAll;
