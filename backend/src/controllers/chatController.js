const Conversation = require('../models/Conversation');
const { repondreQuestion } = require('../services/chatService');

// Poser une question à l'agent IA
exports.poserQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: 'La question ne peut pas être vide.' });
    }

    const { reponse, sources } = await repondreQuestion(question, req.user.id);

    const conversation = await Conversation.create({
      utilisateur: req.user.id,
      question,
      reponse,
      sources,
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer l'historique des conversations de l'utilisateur
exports.getHistorique = async (req, res) => {
  try {
    const conversations = await Conversation.find({ utilisateur: req.user.id }).sort({ dateCreation: -1 });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};