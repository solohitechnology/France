const mongoose = require('mongoose')

const fileSchema =  mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    picture: {
      filename: String,
      mimetype: String,
      path: String,
    },
   
  });
  
  const File = mongoose.model('File', fileSchema);

  module.exports = File;