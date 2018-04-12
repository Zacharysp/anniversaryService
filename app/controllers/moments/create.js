/**
 * Created by Zachary on 3/12/17.
 */
const Joi = require('joi');
const multiparty = require('multiparty');
const moment = require('moment');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const utilities = require('../../utilities');
const util = utilities.util;
const helper = utilities.helper;
const errors = utilities.errors;
const kafkaProducer = utilities.kafkaProducer;

// custom errors
const BadRequest = errors.BadRequest;
const NoEventFound = errors.NoEventFound;
const PermissionDenied = errors.PermissionDenied;

let create = (req, res) => {
    let form = new multiparty.Form();
    let body = {};

    let partCount = 0;
    let photoCount = 0;
    let photoNames = [];

    form.on('error', (err) => {
        logger.error('form error', err);
        util.handleFailResponse(res)(err);
    });

    form.on('part', (part) => {
        part.on('error', (err) => {
            logger.error('part error', err);
            util.handleFailResponse(res)(err);
        });

        if (!part.filename) {
            // fields
            part.on('data', (chunk) => {
                // must put event id as the first part
                if (partCount == 0 && part.name != 'event_id') form.emit('error', new BadRequest());
                partCount++;
                body[part.name] = chunk.toString('utf8');
            });
        }
        if (part.filename) {
            // files
            // must put event id as the first part
            if (!body.event_id) form.emit('error', new BadRequest());
            // rename image with event_id and date
            let ext = findExtension(part.filename, part.headers);
            let photoName = [body.event_id, moment().format(), photoCount].join('_');
            if (ext) photoName += '.' + ext;
            photoNames.push(photoName);

            let options = {
                filename: photoName,
                mode: 'w',
                metadata: {
                    'uploader': req.user.username,
                    'original_name': part.filename
                }
            };
            let writeStream = fileWriteStream(options);

            part.pipe(writeStream);
        }
    });

    form.on('close', () => {
        logger.info('Upload completed!');
        // joi validation
        const schema = Joi.object().keys({
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
        util.validatePromise(body, schema).then((result) =>{
            body = result;
            // verify has worker permission for this event
            return req.model.EventModel.findById(result.event_id);
        }).then((result) => {
            if (!result) throw new NoEventFound();
            // permission denied
            if (result._doc.workers.indexOf(req.user.username) == -1) throw new PermissionDenied();
            // prepare moment doc
            body.owner = req.user.username;
            body.photos = photoNames;
            let moment = new req.model.MomentModel(body);
            return moment.save();
        }).then((result) => {
            // send to kafka, create low quality image files
            kafkaProducer.resizeImage(photoNames);
            let momentDoc = result.toObject();
            util.handleSuccessResponse(res)({
                moment_id: momentDoc._id,
                photos: momentDoc.photos,
                createdAt: momentDoc.createdAt
            });
        }).catch((err) =>{
            // send to kafka, delete image file if existed
            kafkaProducer.deleteService(photoNames);
            return util.handleFailResponse(res)(err);
        });
    });

    form.parse(req);
};

function fileWriteStream(options) {
    // streaming to gridfs
    let gfs = new Grid(mongoose.connection.db, mongoose.mongo);
    let writeStream = gfs.createWriteStream(options);

    writeStream.on('close', (file) => {
        logger.info(file.filename + 'Written To DB');
    });

    writeStream.on('error', (err) => {
        throw err;
    });
    return writeStream;
}

function findExtension(filename, header) {
    // look for original file ext
    const supportedType = ['bmp', 'gif', 'jpg', 'jpeg'];
    let nameStrs = filename.split('.');
    if (supportedType.indexOf(nameStrs[1] != -1)) return nameStrs[1].toLowerCase();
    // look for content-type
    const mime = {
        'image/bmp': 'bmp',
        'image/gif': 'gif',
        'image/jpeg': 'jpg',
        'image/png': 'png'
    };
    return mime[header['content-type']] || null;
}

module.exports = create;
