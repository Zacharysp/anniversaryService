/**
 * Created by dzhang on 3/15/17.
 */


var util = require('../../utilities').util;
var errors = require('../../utilities').errors;
var kafkaProducer = require('../../utilities').kafkaProducer;
var multiparty = require('multiparty');
var moment = require('moment');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var BadRequest = errors.BadRequest;

var upload = function (req, res) {

    var form = new multiparty.Form();

    var photoName;

    form.on("error", function (err) {
        logger.error('form error', err);
        util.handleFailResponse(res)(err);
    });

    form.on("part", function (part) {

        part.on('error', function (err) {
            logger.error('part error', err);
            util.handleFailResponse(res)(err);
        });

        //image file key must be 'image', image file size must less than 1.5m
        if (part.filename && part.name == 'image' && part.byteCount < 1572865) {
            //rename image with username and date
            var ext = findExtension(part.filename, part.headers);
            photoName = [req.user.username, moment().format()].join('_');
            if (ext) photoName += '.' + ext;

            //write to gridfs
            var options = {
                filename: photoName,
                mode: 'w',
                metadata: {
                    'uploader': req.user.username,
                    'original_name': part.filename
                }
            };
            var writeStream = fileWriteStream(options);

            part.pipe(writeStream);
        }
    });

    form.on('close', function () {
        logger.info('Upload completed!');
        if(!photoName) util.handleFailResponse(res)(new BadRequest());
        req.model.UserModel.findOneAndUpdate({username: req.user.username}, {$set: {avatar: photoName}}, function (err) {
            if (err) util.handleFailResponse(res)(err);
            else util.handleSuccessResponse(res)({photo: photoName});
        })
    });

    form.parse(req);
};


function fileWriteStream(options) {
    // streaming to gridfs
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var writeStream = gfs.createWriteStream(options);

    writeStream.on('close', function (file) {
        logger.info(file.filename + 'Written To DB');
        //send to kafka, create low quality image files
        kafkaProducer.resizeAvatar([file.filename]);
    });

    writeStream.on('error', function (err) {
        throw err;
    });
    return writeStream;
}

function findExtension(filename, header) {
    //look for original file ext
    const supportedType = ['bmp', 'gif', 'jpg', 'jpeg'];
    var nameStrs = filename.split('.');
    if (supportedType.indexOf(nameStrs[1] != -1)) return nameStrs[1].toLowerCase();
    //look for content-type
    const mime = {
        "image/bmp": "bmp",
        "image/gif": "gif",
        "image/jpeg": "jpg",
        "image/png": "png"
    };
    return mime[header['content-type']] || null;
}

module.exports = upload;