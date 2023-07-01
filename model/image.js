const ImageSchema = new Schema({
    filename: String,
    description: String,
    contentType: String,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    aliases: [String],
    metadata: {
      author: String,
      keywords: [String]
    }
  });
  
  const Image = mongoose.model('images', ImageSchema);