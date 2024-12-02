const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const returnSchema = new Schema({
    username: String,
    bookid: { type: mongoose.ObjectId, unique: true, ref: 'Book' },
    duedate: { type: Date, ref: 'Borrow' },
    fine: Number,
    
  },{
    timestamps: true
  });


module.exports = mongoose.model('Return', returnSchema);
