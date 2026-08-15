const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  reponse: {
    type: String,
    required: true,
  },
  sources: {
    type: [String],
    default: [],
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);