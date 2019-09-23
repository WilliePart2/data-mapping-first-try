const { codeEntityTypes } = require('../../constants');
const activeRecordCoreFactory = require('./activeRecordCoreFactory');

const bindFields = (fieldsMapping, activeRecordInst, unitOfWork) => {
  /**
   * Here could be used creation of get/set entities via property descriptor.
   * It also could be implemented via proxy
   *
   * For brevity and because of my lazy I leave it as it is.
   */
  Object.keys(fieldsMapping)
    .forEach((fieldName) => {
      const fieldMappingObject = fieldsMapping[fieldName];

      fieldMappingObject.setModelField(fieldName);

      if (!fieldMappingObject.getDestinationField()) {
        fieldMappingObject.setDestinationField(fieldName);
      }

      if (typeof fieldMappingObject.get() === 'object') {
        return bindFields(
          fieldMappingObject.get(),
          (activeRecordInst[fieldName] = activeRecordInst[fieldName] || {}),
          unitOfWork
        );
      }

      /**
       * There is possibility for using custom getter and setter
       * it allows us use memoization and transformation of values
       *
       * @param value
       * @return {*}
       */
      activeRecordInst[fieldName] = function(value) {
        if (value !== undefined) {
          return fieldMappingObject.get();
        }

        this.markAsDirty(activeRecordInst);
        fieldMappingObject.set(value);
      }
    });
};

/**
 * ActiveRecord is a facade for entities on the database layer.
 * This class serve as proxy between controllers code and data layer
 *
 * Factory intended to use in metadata mapping layer
 * @param unitOfWork - unit of work what will perform transformation from different states to db queries
 * @param fieldsMapping - specifications of fields mapping from application object to database structure
 * @param mixinFields - additional functional fields for active records extending
 */

const activeRecordFactory = ({
  unitOfWork,
  fieldsMapping,
  mixinFields = {},
} = {}) => {
  const record = activeRecordCoreFactory({
    unitOfWork,
    mixinFields,
    fieldsMapping,
  });
  const recordFieldsMapping = record.getFieldsMapping();

  bindFields(
    record.getFieldsMapping(),
    record,
    record.getUnitOfWork()
  );

  return record;
};

module.exports = activeRecordFactory;
