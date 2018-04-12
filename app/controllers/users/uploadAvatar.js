/**
 * Created by dzhang on 3/15/17.
 */


const util = require('../../utilities').util;
const errors = require('../../utilities').errors;
const kafkaProducer = require('../../utilities').kafkaProducer;
const multiparty = require('multiparty');
const moment = require('moment');

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const BadRequest = errors.BadRequest;

let upload = (req, res) => {
    let form = new multiparty.Form();

    let photoName;

    form.on('error', (err) => {
        logger.error('form error', err);
        util.handleFailResponse(res)(err);
    });

    form.on('part', (part) => {
        part.on('error', (err) => {
            logger.error('part error', err);
            util.handleFailResponse(res)(err);
        });

        // image file key must be 'image', image file size must less than 1.5m
        if (part.filename && part.name == 'image' && part.byteCount < 1572865) {
            // rename image with username and date
            let ext = findExtension(part.filename, part.headers);
            photoName = [req.user.username, moment().format()].join('_');
            if (ext) photoName += '.' + ext;

            // write to gridfs
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
        if (!photoName) util.handleFailResponse(res)(new BadRequest());
        req.model.UserModel.findOneAndUpdate({username: req.user.username}, {$set: {avatar: photoName}}, (err) => {
            if (err) util.handleFailResponse(res)(err);
            else util.handleSuccessResponse(res)({photo: photoName});
        });
    });

    form.parse(req);
};


let fileWriteStream = (options) => {
    // streaming to gridfs
    let gfs = new Grid(mongoose.connection.db, mongoose.mongo);
    let writeStream = gfs.createWriteStream(options);

    writeStream.on('close', (file) => {
        logger.info(file.filename + 'Written To DB');
        // send to kafka, create low quality image files
        kafkaProducer.resizeAvatar([file.filename]);
    });

    writeStream.on('error', (err) => {
        throw err;
    });
    return writeStream;
};

let findExtension = (filename, header) => {
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
};

module.exports = upload;
