/**
 * Created by dzhang on 3/17/17.
 */
const kafka = require('kafka-node');
const fs = require('fs');
const protobuf = require('protocol-buffers');
const messages = protobuf(fs.readFileSync(process.cwd() + '/app/utilities/anniversary.proto'));

// producer
const producerClient = new kafka.Client('localhost:2181');
const HighLevelProducer = kafka.HighLevelProducer;
const producer = new HighLevelProducer(producerClient);

// topic name
const imageServiceTopic = 'imageService';


exports.deleteService = (fileNames) => {
    let message = messages.ImageMessage.encode({
        action: messages.ImageAction.delete,
        fileNames: fileNames,
        type: messages.ImageType.normal
    });
    produceMessage(message);
};

exports.resizeImage = (fileNames) => {
    let message = messages.ImageMessage.encode({
        action: messages.ImageAction.resize,
        fileNames: fileNames,
        type: messages.ImageType.normal
    });
    produceMessage(message);
};

exports.resizeAvatar = (fileNames) => {
    let message = messages.ImageMessage.encode({
        action: messages.ImageAction.resize,
        fileNames: fileNames,
        type: messages.ImageType.avatar
    });
    produceMessage(message);
};

/**
 * send to Kafka
 */
let produceMessage = (message) => {
    let payloads = [
        {
            topic: imageServiceTopic,
            messages: message
        }
    ];
    producer.send(payloads, (err) => {
        if (err) logger.error();
        logger.info('Producer -> imageService');
    });
};
