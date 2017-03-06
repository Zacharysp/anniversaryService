/**
 * Created by Zachary on 3/6/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');

var EventSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    moments: {
        type: Array
    },
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String
    },
    status: {
        type: Number,
        required: true
    }
});

EventSchema.plugin(CreateUpdatedAt);


var EventModel = mongoose.model('Event', EventSchema);

module.exports = EventModel;