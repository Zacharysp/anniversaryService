/**
 * Created by Zachary on 3/6/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');

var EventWorkerSchema = new mongoose.Schema({
    event_id: {
        type: ObjectId
    },
    worker: {
        type: String
    }
});

EventWorkerSchema.plugin(CreateUpdatedAt);


var EventWorkerModel = mongoose.model('EventWorker', EventWorkerSchema);

module.exports = EventWorkerModel;