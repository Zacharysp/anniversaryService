/**
 * Created by Zachary on 3/6/17.
 */
const mongoose = require('mongoose');
const CreateUpdatedAt = require('mongoose-timestamp');

const EventSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    moments: [
        {
            type: String,
            ref: 'Moment'
        }
    ],
    title: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    cover: {
        type: String
    },
    status: {
        type: Number,
        required: true
    },
    workers: [{
        type: String,
        ref: 'User'
    }],
    comment: {
        type: String
    }
});

EventSchema.plugin(CreateUpdatedAt);

let EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;
