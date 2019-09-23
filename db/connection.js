const mongoose = require('mongoose');
const { dbConfig } = require('../config');

module.exports = () => mongoose.connect(`mongodb://${dbConfig.DB_HOST}:${dbConfig.DB_PORT}/${dbConfig.DB_NAME}`, {
  useNewUrlParser: dbConfig.USE_NEW_USER_PARSER,
  useFindAndModify: dbConfig.USE_FIND_AND_MODIFY,
  useCreateIndex: dbConfig.USE_CREATE_INDEX,
  autoIndex: dbConfig.AUTO_INDEX,
  poolSize: dbConfig.POOL_SIZE,
  keepAlive: dbConfig.KEEP_ALIVE,
  reconnectInterval: dbConfig.RECONNECT_INTERVAL,
  reconnectTries: dbConfig.RECONNECT_TRIES,
  connectTimeoutMS: dbConfig.CONNECT_TIMEOUT_MS,
  socketTimeoutMS: dbConfig.SOCKET_TIMEOUT_MS,
});
module.exports.connection = mongoose.connection;
