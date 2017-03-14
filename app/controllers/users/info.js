/**
 * Created by Zachary on 3/14/17.
 */

var util = require('../../utilities').util;

var info = function (req, res) {
    req.model.EventWatcherModel.find({watcher: req.user.username}, 'event_id', function(err, results){
        if (err) util.handleFailResponse(res)(err);
        logger.info(results);
        var watched_events = [];
        results.forEach(function (result) {
            watched_events.push(result.toObject().event_id);
        });
        util.handleSuccessResponse(res)({
            createdAt: req.user.createdAt,
            username: req.user.username,
            work_event: req.user.work_event,
            watched_event: watched_events,
            email: req.user.email
        });
    });
};

module.exports = info;