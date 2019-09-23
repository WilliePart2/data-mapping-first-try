const { utils } = require('../../libs');

const baseUnitOfWorkFactory = () => ({
  _dirtyMap: [],
  _newMap: [],
  _removedMap: [],
  _cleanMap: [],
  _cleanState: {},
  _excludeObject(object, map) {
    return map.filter(item => item !== object);
  },
  _isIncluded(object, map) {
    return map.some(item => item === object);
  },
  markAsClean(object) {
    this._dirtyMap = this._excludeObject(object, this._dirtyMap);
    this._removedMap = this._excludeObject(object, this._removedMap);
    this._newMap = this._excludeObject(object, this._newMap);
    this._cleanMap = this._excludeObject(object, this._cleanMap);

    // need improve parsing of fieldsMap structure
    this._cleanState = utils.deepMerge(
      object.getFieldsMapping(),
        field => field.get()
    );

    this._cleanMap.push(object);
  },
  markAsDirty(object) {
    if (this._isIncluded(object, this._removedMap)) {
      return;
    }

    this._cleanMap = this._excludeObject(object, this._cleanMap);
    this._dirtyMap = this._excludeObject(object, this._dirtyMap);

    this._dirtyMap.push(object);
  },
  markAsNew(object) {
    this._cleanMap = this._excludeObject(object, this._cleanMap);

    this._newMap.push(object);
  },
  markAsRemoved(object) {
    this._dirtyMap = this._excludeObject(object, this._dirtyMap);
    this._cleanMap = this._excludeObject(object, this._cleanMap);

    this._removedMap.push(object);
  }
});

module.exports = baseUnitOfWorkFactory;
