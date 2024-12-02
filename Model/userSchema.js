const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
  mobile: { type: Number, unique: true },
  admin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
