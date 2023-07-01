const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverPhoto: {
    type: Schema.Types.ObjectId,
    ref: 'images'
  },
  pdfFile: {
    type: Schema.Types.ObjectId,
    ref: 'pdfs'
  }
}, { timestamps: true });



const Book = mongoose.model('Book', BookSchema);

