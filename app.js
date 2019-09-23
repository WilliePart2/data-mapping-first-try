const express = require('express');
const { serverConfig } = require('./config');
const { connection, metadataMapping } = require('./db');

connection();
metadataMapping();
const app = express();

app.listen(serverConfig.SERVER_PORT, () => {
  console.log(`App listens on ${serverConfig.SERVER_PORT} port`);
});
