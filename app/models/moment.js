/**
 * Created by Zachary on 3/12/17.
 */
"use strict";
var mongoose = require('mongoose');
var CreateUpdatedAt = require('mongoose-timestamp');
var ObjectId = mongoose.Schema.ObjectId;

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
            type: ObjectId
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
    location: {
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

// MomentSchema.methods.fileWriteStream = function(filename, uploader){
//     var options = {
//         filename: filename,
//         mode: 'w',
//         metadata: {
//             'uploader': uploader
//         }
//     };
//     // streaming to gridfs
//     //filename to store in mongodb
//     var gfs = Grid(mongoose.connection.db, mongoose.mongo);
//     var writeStream = gfs.createWriteStream(options);
//
//     writeStream.on('close', function (file) {
//         // do something with `file`
//         console.log(file.filename + 'Written To DB');
//     });
//
//     writeStream.on('error', function (err) {
//         throw err;
//     });
//
//     return writeStream;
// };

// trackDocsSchema.methods.addFile = function(file, options, fn) {
//     var trackDocs;
//     trackDocs = this;
//     return gridfs.putFile(file.path, file.name, options, function(err, result) {
//         if (err) console.log("postDocsModel TrackDocs Error: " + err);
//
//         trackDocs.files.push(result);
//         return trackDocs.save(fn);
//     });
// };


var MomentModel = mongoose.model('Moment', MomentSchema);

module.exports = MomentModel;