const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  age: Number,
});

const model = mongoose.model('user', schema);

module.exports = {
  schema,
  model,
};
