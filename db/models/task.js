const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  ownerId: String,
  title: String,
  content: String,
});

const model = mongoose.model('task', schema);

module.exports = {
  schema,
  model,
};
