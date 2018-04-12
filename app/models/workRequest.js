/**
 * Created by dzhang on 3/7/17.
 */
const mongoose = require('mongoose');
const CreateUpdatedAt = require('mongoose-timestamp');
const ObjectId = mongoose.Schema.ObjectId;

const WorkerRequestSchema = new mongoose.Schema({
    event_id: {
        type: ObjectId
    },
    worker: {
        type: String
    }
});

WorkerRequestSchema.plugin(CreateUpdatedAt);

WorkerRequestSchema.index({event_id: 1});


let WorkerRequestModel = mongoose.model('EventWorker', WorkerRequestSchema);

module.exports = WorkerRequestModel;
