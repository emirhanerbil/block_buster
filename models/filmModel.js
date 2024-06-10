const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filmSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  actors: {
    type: [String],
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  isInTheaters: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  posters: [{
    path: String
  }],
  trailerUrl: {
    type: String,
    required: true
  },
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

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
