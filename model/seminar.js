const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SeminarSchema = new Schema({
  content: String,
  picture: {
    filename: String,
    mimetype: String,
    path: String,
  },
  link:String,
 
});

module.exports = mongoose.model('Seminar', SeminarSchema);
