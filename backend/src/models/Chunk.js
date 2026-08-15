const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true,
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  texte: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model('Chunk', chunkSchema);