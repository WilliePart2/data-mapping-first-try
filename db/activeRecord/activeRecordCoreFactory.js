const activeRecordCoreFactory = ({ unitOfWork, mixinFields, fieldsMapping }) => {
  const record = {
    _entityMap: undefined,
    _unitOfWork: unitOfWork,
    _fieldsMapping: fieldsMapping,
    _initialize(entityMap) {
      this._entityMap = entityMap;
    },
    getFieldsMapping() {
      return this._fieldsMapping;
    },
    getEntityMap() {
      return this._entityMap;
    },
    getDataMapper() {
      return this.getEntityMap().getDataMapper();
    },
    getUnitOfWork() {
      return this._unitOfWork;
    },
    async save() {
      await this.getDataMapper().save({
        activeRecord: this,
      });
    },
    async load(criteria) {
      await this.getDataMapper().load({
        criteria,
        activeRecord: this,
      });
    },
    create(dataObj = {}) {
      const inst = this.getEntityMap().getActiveRecord();
      for (const [key, value] of Object.entries(dataObj)) {
        inst[key] = value;
      }

      return inst;
    },
    markAsClean() {
      this.getUnitOfWork().registerAsClean(this);
    },
    markAsNew() {
      this.getUnitOfWork().registerAsNew(this);
    },
    markAsRemoved() {
      this.getUnitOfWork().registerAsRemoved(this);
    },
    markAsDirty() {
      this.getUnitOfWork().registerAsDirty(this);
    },
    ...mixinFields
  };

  // record.markAsClean = () => unitOfWork.registerClean(record);
  // record.markAsNew = () => unitOfWork.registerNew(record);
  // record.markAsRemoved = () => unitOfWork.registerAsRemoved(record);

  return record;
};

module.exports = activeRecordCoreFactory;
