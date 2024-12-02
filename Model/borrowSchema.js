const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowSchema = new Schema({
  username: String,
  bookid: { type: mongoose.ObjectId, unique: true, ref: 'Book' },
  duedate: {
    type: Date,
    default: () => new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Borrow', borrowSchema);
