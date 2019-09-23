const dataMapperFactory = ({ entityMap, storageModel }) => ({
  save() {
    console.log('Save data');
  },
  load(criteria) {
    console.log('Load data');
  },
});

module.exports = dataMapperFactory;
