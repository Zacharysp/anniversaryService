/**
 * Created by Zachary on 3/6/17.
 */
const mongoose = require('mongoose');
const CreateUpdatedAt = require('mongoose-timestamp');
const ObjectId = mongoose.Schema.ObjectId;

const EventWatcherSchema = new mongoose.Schema({
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

let EventWatcherModel = mongoose.model('EventWatcher', EventWatcherSchema);

module.exports = EventWatcherModel;
