/**
 * Created by Zachary on 3/12/17.
 */

var util = require('../../utilities').util;
var helper = require('../../utilities').helper;
var errors = require('../../utilities').errors;
var Joi = require('joi');
var multiparty = require('multiparty');
var moment = require('moment');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var BadRequest = errors.BadRequest;
var NoEventFound = errors.NoEventFound;
var PermissionDenied = errors.PermissionDenied;

var create = function (req, res) {

    var form = new multiparty.Form();
    var body = {};

    var partCount = 0;
    var photoCount = 0;
    var photoNames = [];

    form.on("error", function (err) {
        logger.error('form error', err);
        util.handleFailResponse(res)(err);
    });

    form.on("part", function (part) {

        part.on('error', function (err) {
            logger.error('part error', err);
            util.handleFailResponse(res)(err);
        });

        if (!part.filename) {
            //fields
            part.on('data', function (chunk) {
                //must put event id as the first part
                if (partCount == 0 && part.name != 'event_id') form.emit('error', new BadRequest());
                partCount++;
                body[part.name] = chunk.toString('utf8');
            });
        }
        if (part.filename) {
            //files
            //must put event id as the first part
            if (!body.event_id) form.emit('error', new BadRequest());
            //rename image with event_id and date
            var ext = findExtension(part.filename, part.headers);
            var photoName = [body.event_id, moment().format(), photoCount].join('_');
            if (ext) photoName += '.' + ext;
            photoNames.push(photoName);

            var options = {
                filename: photoName,
                mode: 'w',
                metadata: {
                    'uploader': req.authInfo,
                    'original_name': part.filename
                }
            };
            var writeStream = fileWriteStream(options);

            part.pipe(writeStream);
        }
    });

    form.on('close', function () {
        logger.info('Upload completed!');
        //joi validation
        var schema = Joi.object().keys({
            event_id: Joi.string().length(24).required(),
            content: Joi.string().max(10),
            temp: Joi.number().min(-100).max(100),
            latitude: Joi.number().min(-180).max(180),
            longitude: Joi.number().min(-180).max(180),
            ip: Joi.string().ip({
                version: ['ipv4', 'ipv6'],
                cidr: 'optional'
            }),
            weather: Joi.number().min(0).max(helper.weatherList().length),
            mood: Joi.number().min(0).max(helper.moodList().length),
            is_milestone: Joi.boolean().truthy('yes').falsy('no').insensitive(false).default(false)
        }).and('latitude', 'longitude');
        util.validatePromise(body, schema).then(function (result) {
            body = result;
            //verify has worker permission for this event
            return req.model.EventModel.findById(result.event_id);
        }).then(function (result) {
            if (!result) throw new NoEventFound();
            // permission denied
            if (result._doc.workers.indexOf(req.authInfo) == -1) throw new PermissionDenied();
            //TODO: delete image file when permission denied
            //prepare moment doc
            body.owner = req.authInfo;
            body.photos = photoNames;
            var moment = new req.model.MomentModel(body);
            return moment.save();
        }).then(function (result) {
            var momentDoc = result.toObject();
            util.handleSuccessResponse(res)({
                moment_id: momentDoc._id,
                photos: momentDoc.photos,
                createdAt: momentDoc.createdAt
            });
        }).catch(function (err) {
            return util.handleFailResponse(res)(err);
        });
    });

    form.parse(req);
};

function fileWriteStream(options) {
    // streaming to gridfs
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var writeStream = gfs.createWriteStream(options);

    writeStream.on('close', function (file) {
        logger.info(file.filename + 'Written To DB');
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
    if (supportedType.indexOf(nameStrs[1] != -1)) return nameStrs[1];
    //look for content-type
    const mime = {
        "image/bmp": "bmp",
        "image/gif": "gif",
        "image/jpeg": "jpg",
        "image/png": "png"
    };
    return mime[header['content-type']] || null;
}

module.exports = create;
