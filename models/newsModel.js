const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String]
  },
  images: [{
    path: {
      type: String
    }
  }],
  slug: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
