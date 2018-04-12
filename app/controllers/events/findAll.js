/**
 * Created by dzhang on 3/28/17.
 */

const util = require('../../utilities').util;
const Promise = require('bluebird');

let findAll = (req, res) => {
    let promiseArray = [];
    req.user.work_event.forEach((eventId) => {
        promiseArray.push(req.model.EventModel.findById(eventId, '_id title cover from owner status workers moments'));
    });
    Promise.all(promiseArray).then((results) => {
        util.handleSuccessResponse(res)(results);
    }).catch((err) => {
        return util.handleFailResponse(res)(err);
    });
};

module.exports = findAll;
