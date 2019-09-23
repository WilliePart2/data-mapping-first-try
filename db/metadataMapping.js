const { activeRecordFactory, proxyActiveRecordFactory } = require('./activeRecord');
const { dataMapperFactory } = require('./dataMapping');
const { fieldMappingFactory } = require('./fieldMapping');
const { entityMapFactory } = require('./metadataMapping/index');
const { baseUnitOfWorkFactory } = require('./unitOfWork');
const { resources } = require('../constants');
const { userModel, taskModel } = require('./models');
const { utils } = require('../libs');
const { dataMappers } = require('../core');
const test = require('./test');

/**
 * Here is configurations of entities which provide services for application
 */
module.exports = () => {
  // console.log(entityMapFactory);
  entityMapFactory({
    key: resources.USER,
    activeRecordKey: resources.USER_ACTIVE_RECORD,
    storageModelFactory: utils.createFactory({
      providerFn: () => userModel
    }),
    dataMapperFactory: utils.createFactory({
      providerFn: (...args) => dataMapperFactory(...args)
    }),
    activeRecordFactory: utils.createFactory({
      providerFn: () => proxyActiveRecordFactory({
        unitOfWork: baseUnitOfWorkFactory(),
        fieldsMapping: {
          name: fieldMappingFactory(),
          address: fieldMappingFactory('address', {
            street: fieldMappingFactory(),
            city: fieldMappingFactory()
          }),
        }
      })
    })
  });

  const userActiveRecord = dataMappers.get(resources.USER_ACTIVE_RECORD);
  // userActiveRecord.load();

  const uar = userActiveRecord.create({
    name: 'Vasia',
    address: {
      street: 'Some street',
      city: 'Some city'
    }
  });

  const testModel = test.createDbModel({
    name: null,
    age: null,
  });

  testModel.name = 'Some';
  console.log(testModel.name);
  console.log(testModel);

  // console.log(uar.name);
  // console.log(uar.address.street);
  // console.log(uar.address.city);

  // userActiveRecord.save();
};
