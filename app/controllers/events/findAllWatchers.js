/**
 * Created by Zachary on 3/11/17.
 */

const util = require('../../utilities/index').util;
const errors = require('../../utilities/index').errors;
const Joi = require('joi');

const NoEventFound = errors.NoEventFound;

const perPage = 100;

let findAllWatchers = (req, res) => {
    // JOI validation
    const joiSchema = Joi.object().keys({
        event_id: Joi.string().length(24).required(),
        page: Joi.number()
    });
    util.validatePromise(req.query, joiSchema).then((result) => {
        return req.model.EventModel.findById(result.event_id);
    }).then((result) => {
        if (!result) throw new NoEventFound();
        let page = req.query.page || 0;
        return req.model.EventWatcherModel
            .find({'event_id': req.query.event_id})
            .select('watcher')
            .limit(perPage)
            .skip(perPage * page);
    }).then((result) => {
        util.handleSuccessResponse(res)(result.map(function(value) {
            return value.watcher;
        }));
    }).catch((err) =>{
        return util.handleFailResponse(res)(err);
    });
};

module.exports = findAllWatchers;
