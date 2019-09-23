const { dataMappers, createProvider } = require('../../core');
const { utils } = require('../../libs');

/**
 * It's high level function what could determine mapping and initialize active record
 *
 * @TODO: need to add registration of service in data mapping registry by entity key
 * @param activeRecordFactory
 * @param storageModel
 * @param dataMapperFactory
 * @return {{_storageModel: *, _activeRecord: *, getStorageModel(): *}|*}
 */
module.exports = ({
  activeRecordFactory,
  storageModelFactory,
  dataMapperFactory,
  activeRecordKey,
  key
}) => {
  const entityMap = {
    _activeRecordFactory: activeRecordFactory,
    _storageModelFactory: storageModelFactory,
    _dataMapperFactory: dataMapperFactory,
    getStorageModel() {
      return this._storageModelFactory.create();
    },
    getDataMapper(...args) {
      return this._dataMapperFactory.create({
        ...args,
        storageModel: this.getStorageModel(),
      });
    },
    getActiveRecord() {
      const activeRecord = this._activeRecordFactory.create();
      activeRecord._initialize(entityMap);

      return activeRecord;
    }
  };

  dataMappers.set(key, createProvider({
    value: entityMap,
  }));

  dataMappers.set(activeRecordKey, createProvider({
    factory: utils.createFactory({
      providerFn: () => entityMap.getActiveRecord()
    })
  }));

  // console.log(dataMappers._)

  return entityMap;
};
