const { utils } = require('../../libs');
const activeRecordCoreFactory = require('./activeRecordCoreFactory');

/**
 * Set proxies for fields with 'deep-first' method
 *
 * @param activeRecordInst
 * @param fieldsMapping
 * @return {*}
 */
const bindFields = ({ activeRecordInst, fieldsMapping }) => {
  Object.entries(fieldsMapping)
    .forEach(([fieldName, fieldMap]) => {
      fieldMap.setModelField(fieldName);

      if (typeof fieldMap.get() === 'object') {
        const obj = {};
        const boundFields = bindFields({
          activeRecordInst: obj,
          fieldsMapping: fieldMap.get(),
        });

        obj.__fieldMeta = fieldMap.get();

        fieldMap.set(boundFields);
      }
    });

  const proxiedInst = new Proxy(activeRecordInst, {
    get(target, key, context) {
      for (const [_, fieldMap] of Object.entries(fieldsMapping)) {
        if (fieldMap.getModelField() !== key) {
          continue;
        }

        const val = fieldMap.get();
        switch (typeof val) {
          case 'object':
            const result = {};
            Object.entries(val.__fieldMeta)
              .forEach(([field, data]) => result[field] = data.get());

            return result;
            break;
          default:
            return val;
        }
      }

      return Reflect.get(target, key);
    },
    set(target, key, value, context) {
      for (const [_, fieldMap] of Object.entries(fieldsMapping)) {
        if (fieldMap.getModelField() !== key) {
          continue;
        }

        switch (typeof value) {
          case 'object':
            const val = fieldMap.get();
            Object.entries(value)
              .forEach(([field, value]) => val[field] = value);
            break;
          default:
            fieldMap.set(value);
            return true;
        }
      }

      if (Reflect.has(target, key)) {
        return Reflect.set(target, key, value);
      }

      return false;
    }
  });

  return proxiedInst;
};

module.exports = ({ unitOfWork, fieldsMapping, entityMap }) => {
  const record = activeRecordCoreFactory({ unitOfWork, fieldsMapping });

  return bindFields({
    activeRecordInst: record,
    fieldsMapping,
  });
};
