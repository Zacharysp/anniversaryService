/**
 * Created by dzhang on 3/17/17.
 */

"use strict";
var kafka = require('kafka-node');
var fs = require('fs');
var protobuf = require('protocol-buffers');
var messages = protobuf(fs.readFileSync(process.cwd() + '/app/utilities/anniversary.proto'));

//producer
var producerClient = new kafka.Client("localhost:2181");
var HighLevelProducer = kafka.HighLevelProducer;
var producer = new HighLevelProducer(producerClient);

//topic name
var imageServiceTopic = 'imageService';


exports.deleteService = function (fileNames) {
    var message = messages.ImageMessage.encode({
        action: messages.ImageAction.delete,
        fileNames: fileNames,
        type: messages.ImageType.normal
    });
    produceMessage(message);
};

exports.resizeImage = function (fileNames) {
    var message = messages.ImageMessage.encode({
        action: messages.ImageAction.resize,
        fileNames: fileNames,
        type: messages.ImageType.normal
    });
    produceMessage(message);
};

exports.resizeAvatar = function (fileNames) {
    var message = messages.ImageMessage.encode({
        action: messages.ImageAction.resize,
        fileNames: fileNames,
        type: messages.ImageType.avatar
    });
    produceMessage(message);
};

/**
 * send to Kafka
 */
function produceMessage(message) {
    var payloads = [
        {
            topic: imageServiceTopic,
            messages: message
        }
    ];
    producer.send(payloads, function (err) {
        if (err) logger.error();
        logger.info('Producer -> imageService');
    });
}