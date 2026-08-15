const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nomOriginal: {
    type: String,
    required: true,
  },
  nomFichier: {
    type: String,
    required: true,
  },
  cheminFichier: {
    type: String,
    required: true,
  },
  typeFichier: {
    type: String,
    required: true,
  },
  taille: {
    type: Number,
    required: true,
  },
 texteExtrait: {
    type: String,
    default: '',
  },
  resume: {
    type: String,
    default: '',
  },
  motsCles: {
    type: [String],
    default: [],
  },
  typeDocument: {
    type: String,
    default: 'Autre',
  },
  nombrePages: {
    type: Number,
    default: 0,
  },
  dateUpload: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Document', documentSchema);