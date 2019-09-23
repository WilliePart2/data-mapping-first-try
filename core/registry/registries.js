const BaseRegistry = require('./baseRegistry');

const registry = new BaseRegistry('APP_REGISTRY');
const dataMappers = new BaseRegistry('DATA_MAPPER');

module.exports = {
  registry,
  dataMappers
};
