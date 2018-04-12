/**
 * Created by dzhang on 3/15/17.
 */

const util = require('../../utilities').util;
const errors = require('../../utilities').errors;
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const NoImageIdFound = errors.NoImageIdFound;

let findAvatar = (req, res) => {
    logger.info(req.user.avatar);
    let filename = req.user.avatar;
    if (req.query.quality == 'low') {
        let strs = filename.split('.');
        filename = [strs[0] + '_low', strs[1]].join('.');
    }
    // streaming from gridfs
    let gfs = new Grid(mongoose.connection.db, mongoose.mongo);
    let readStream = gfs.createReadStream({
        filename: filename
    });
    // error handling
    readStream.on('error', (err) => {
        logger.error('error on fetch from gridfs', err);
        util.handleFailResponse(res)(new NoImageIdFound());
    });
    // pass to response
    readStream.pipe(res);
};

module.exports = findAvatar;
