/**
 * Created by Zachary on 3/6/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.ObjectId;

var EventWatcherSchema = new mongoose.Schema({
    event_id: {
        type: ObjectId,
        index: true
    },
    watcher: {
        type: String,
        index: true
    }
});

EventWatcherSchema.plugin(CreateUpdatedAt);

var EventWatcherModel = mongoose.model('EventWatcher', EventWatcherSchema);

module.exports = EventWatcherModel;