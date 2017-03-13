/**
 * Created by Zachary on 3/12/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');

var MomentSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    photos: [
        {
            type: String
        }
    ],
    comments: [
        {
            username: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            createAt: {
                type: String,
                required: true
            }
        }
    ],
    temp: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    ip:{
        type: String
    },
    weather: {
        type: Number
    },
    mood: {
        type: Number
    },
    is_milestone: {
        type: Boolean,
        required: true
    }
});

MomentSchema.plugin(CreateUpdatedAt);

var MomentModel = mongoose.model('Moment', MomentSchema);

module.exports = MomentModel;