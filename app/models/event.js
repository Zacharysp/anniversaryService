/**
 * Created by Zachary on 3/6/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');

var EventSchema = new mongoose.Schema({
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
    }]
});

EventSchema.plugin(CreateUpdatedAt);


var EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;