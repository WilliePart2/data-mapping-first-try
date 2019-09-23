const { codeEntityTypes } = require('../../constants');

/**
 *
 * @param {string} destinationField
 * @param {*} value
 * @returns {{
 *   get: function,
 *   set: function,
 *   setDestinationField: function,
 *   getDestinationField: function
 * }}
 */
const fieldMappingFactory = (destinationField, value) => ({
  _type: codeEntityTypes.FIELDS_MAPPING,
  _value: value,
  _modelField: undefined,
  _destinationField: destinationField,
  set(value) {
    this._value = value;
  },
  get() {
    return this._value;
  },
  setModelField(modelField) {
    this._modelField = modelField;
  },
  getModelField() {
    return this._modelField;
  },
  setDestinationField(fieldName) {
    this._destinationField = fieldName;
  },
  getDestinationField() {
    return this._destinationField;
  }
});

module.exports = fieldMappingFactory;
