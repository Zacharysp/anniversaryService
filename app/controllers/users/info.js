/**
 * Created by Zachary on 3/14/17.
 */

const util = require('../../utilities').util;

let info = (req, res) => {
    req.model.EventWatcherModel.find({watcher: req.user.username}, 'event_id', (err, results) => {
        if (err) util.handleFailResponse(res)(err);
        logger.info(results);
        let watchedEvents = [];
        results.forEach((result) => {
            watchedEvents.push(result.toObject().event_id);
        });
        util.handleSuccessResponse(res)({
            createdAt: req.user.createdAt,
            username: req.user.username,
            work_event: req.user.work_event,
            watched_event: watchedEvents,
            email: req.user.email
        });
    });
};

module.exports = info;
