/**
 * Created by Zachary on 3/12/17.
 */

var util = require('../../utilities').util;
var helper = require('../../utilities').helper;
var Joi = require('joi');
var multiparty = require('multiparty');

var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

var create = function (req, res) {

    var form = new multiparty.Form();

    // form.on("part", function(part){
    //
    //     if(!part.filename)
    //     {
    //         // logger.info(part);
    //         part.on('data', function(chunk){
    //             setTimeout(function() {
    //                 logger.info(chunk.toString('utf8'))
    //             }, 3000);
    //         });
    //     }
    //
    //     if(part.filename)
    //     {
    //         // logger.info(part.name);
    //         // logger.info(part.name);
    //         // logger.info(part.name);
    //
    //         // var options = {
    //         //     filename: filename,
    //         //     mode: 'w',
    //         //     metadata: {
    //         //         'uploader': req.authInfo,
    //         //         'original_name': part.filename,
    //         //         'event_id':
    //         //     }
    //         // };
    //         // var writeStream = fileWriteStream(options);
    //         //
    //         // part.pipe(writeStream);
    //
    //         logger.info(part.filename);
    //         part.resume();
    //     }
    //
    //     part.on('error', function(err) {
    //         logger.error(err);
    //     });
    // });
    //
    //
    // form.on("error", function(err){
    //     logger.error(err);
    // });
    //
    // form.on('close', function() {
    //     logger.info('Upload completed!');
    //     res.status(200).send('ok');
    // });

    form.parse(req, function(err, fields, files) {
        var body = {};
        Object.keys(fields).forEach(function(name) {
            //destruct fields value with fields name
            if (!body[name]) body[name] = fields[name][0];
        });
        //joi validation
        var schema = Joi.object().keys({
            content: Joi.string().max(10),
            temp: Joi.number().min(0).max(10),
            location: Joi.string(),
            weather: Joi.number().min(0).max(helper.weatherList().length),
            mood: Joi.number().min(0).max(helper.moodList().length),
            is_milestone: Joi.boolean()
        });
        util.validatePromise(body, schema).then(function(results){
            //rename image with event_id and date
            res.status(200).send(results);
        }).catch(function(err){
            return util.handleFailResponse(res)(err);
        });


        // logger.info(fields);

        // Object.keys(files).forEach(function(name) {
        //     console.log('got file named ' + name);
        // });
        //
        // console.log('Upload completed!');
        // res.status(200).send('ok');
    });
};

function validation(value, callback){

    Joi.validate(value, joiSchema, callback);
}



function fileWriteStream(options){
    // streaming to gridfs
    //filename to store in mongodb
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    var writeStream = gfs.createWriteStream(options);

    writeStream.on('close', function (file) {
        // do something with `file`
        console.log(file.filename + 'Written To DB');
    });

    writeStream.on('error', function (err) {
        throw err;
    });
    //
    // return writeStream;
    //
    // var gfs = Grid(require('../../utilities').dbClient);
    // // streaming to gridfs
    // //filename to store in mongodb
    // var writeStream = gfs.createWriteStream({
    //     filename: 'filename'
    // });
    //
    // writeStream.on('close', function (file) {
    //     // do something with `file`
    //     console.log(file.filename + 'Written To DB');
    // });
    //
    // writeStream.on('error', function (err) {
    //     throw err;
    // });

    return writeStream;
};



module.exports = create;
