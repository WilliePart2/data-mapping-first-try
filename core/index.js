const { dataMappers, registry } = require('./registry/registries');
const createProvider = require('./registry/provider');

module.exports = {
  dataMappers,
  registry,
  createProvider,
};
