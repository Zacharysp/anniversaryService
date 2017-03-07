/**
 * Created by dzhang on 3/7/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.ObjectId;

var WorkerRequestSchema = new mongoose.Schema({
    event_id: {
        type: ObjectId
    },
    worker: {
        type: String
    }
});

WorkerRequestSchema.plugin(CreateUpdatedAt);

WorkerRequestSchema.index({ event_id: 1 });


var WorkerRequestModel = mongoose.model('EventWorker', WorkerRequestSchema);

module.exports = WorkerRequestModel;