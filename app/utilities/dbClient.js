/**
 * Created by dzhang on 2/6/17.
 */
const config = require('config');
const mongoose = require('mongoose');
const dbConfig = config.get('dbConfig');

const connectionString = 'mongodb://' +dbConfig.username +
':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.db + '';

const options = {
  db: {native_parser: true},
  server: {poolSize: 5}
};

logger.info('Connect mongodb to: ' + connectionString);

mongoose.connect(connectionString, options, function(err) {
  if (err) {
    logger.error('Error connecting to: ', +connectionString + '. ' + err);
    return process.exit(1);
  } else {
    return logger.info('Successfully connected to: ' + connectionString);
  }
});
mongoose.Promise = require('bluebird');

let dbClient = mongoose.connection;

dbClient.on('error', (err) => {
    return logger.error('Mongoose connect fail:', err);
});

dbClient.once('open', function() {
  return logger.info('Mongoose connect success');
});

module.exports.dbClient = dbClient;
