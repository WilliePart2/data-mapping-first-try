const createFieldMap = ({ fieldName, value }) => {
  return {
    _value: value,
    _fieldName: fieldName,
    set(value) {
      this._value = value;
    },
    get() {
      return this._value;
    },
    getModelField() {
      return this._fieldName;
    },
  };
};

const bindFields = ({ model, fieldsMap }) => {
  Object.values(fieldsMap)
    .forEach((fieldMap) => {
      if (typeof fieldMap.get() === 'object' && fieldMap.get()) {
        const nestedModel = {};
        fieldMap.set(
          bindFields({
            model: nestedModel,
            fieldsMap: fieldMap.get(),
          })
        );

        nestedModel.__fieldsMap = fieldMap.get();
      }
    });

  return new Proxy(model, {
    get(target, key, context) {
      for (const [fieldName, fieldMap] of Object.entries(fieldsMap)) {
        if (fieldName === key) {
          return fieldMap.get();
        }
      }

      if (Reflect.has(target, key)) {
        return Reflect.get(target, key);
      }
    },
    set(target, key, value, context) {
      for (const [fieldName, fieldMap] of Object.entries(fieldsMap)) {
        if (fieldName === key) {
          fieldMap.set(value);
          return true;
        }
      }

      if (Reflect.has(target, key)) {
        return Reflect.set(target, key, value);
      }
    }
  });
};

const createDbModel = (model) => {
  let fieldMap = {};
  Object.entries(model)
    .forEach(([fieldName, value]) => {
      // dont handle methods
      if (typeof value === 'function') {
        return;
      }

      if (!model.__fieldsMap) {
        fieldMap = model.__fieldsMap = {};
      }

      model.__fieldsMap[fieldName] = createFieldMap({
        fieldName,
        value,
      });
    });

  return bindFields({
    model,
    fieldsMap: fieldMap,
  });
};

module.exports = {
  createDbModel,
};
