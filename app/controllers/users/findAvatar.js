/**
 * Created by dzhang on 3/15/17.
 */

var util = require('../../utilities').util;
var errors = require('../../utilities').errors;
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var NoImageIdFound = errors.NoImageIdFound;

var findAvatar = function (req, res) {
    logger.info(req.user.avatar);
    var filename = req.user.avatar;
    if (req.query.quality == 'low') {
        var strs = filename.split('.');
        filename = [strs[0] + '_low', strs[1]].join('.');
    }
    // streaming from gridfs
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var readStream = gfs.createReadStream({
        filename: filename
    });
    //error handling
    readStream.on('error', function (err) {
        logger.error('error on fetch from gridfs', err);
        util.handleFailResponse(res)(new NoImageIdFound());
    });
    //pass to response
    readStream.pipe(res);
};

module.exports = findAvatar;