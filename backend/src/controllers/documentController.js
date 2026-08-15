const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');
const { extraireTexte } = require('../services/extractionService');
const { genererResume, extraireMotsCles, identifierTypeDocument } = require('../services/geminiService');
const { indexerDocument } = require('../services/ragService');

// Upload d'un document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé.' });
    }

    const { texte, nombrePages } = await extraireTexte(req.file.path, req.file.mimetype);

    // Analyses IA (uniquement si du texte a bien été extrait)
    let resume = '';
    let motsCles = [];
    let typeDocument = 'Autre';

    if (texte && texte.trim().length > 0) {
      [resume, motsCles, typeDocument] = await Promise.all([
        genererResume(texte),
        extraireMotsCles(texte),
        identifierTypeDocument(texte),
      ]);
    }

   const document = await Document.create({
      utilisateur: req.user.id,
      nomOriginal: req.file.originalname,
      nomFichier: req.file.filename,
      cheminFichier: req.file.path,
      typeFichier: req.file.mimetype,
      taille: req.file.size,
      texteExtrait: texte,
      resume,
      motsCles,
      typeDocument,
      nombrePages,
    });

    // Indexation RAG en arrière-plan (ne bloque pas la réponse à l'utilisateur)
    if (texte && texte.trim().length > 0) {
      indexerDocument(document._id, req.user.id, texte)
        .then((nb) => console.log(`✅ Document indexé : ${nb} chunks créés.`))
        .catch((err) => console.error('Erreur indexation :', err.message));
    }

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Lister les documents de l'utilisateur connecté
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ utilisateur: req.user.id }).sort({ dateUpload: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Supprimer un document
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, utilisateur: req.user.id });

    if (!document) {
      return res.status(404).json({ message: 'Document introuvable.' });
    }

    // Supprimer le fichier physique
    if (fs.existsSync(document.cheminFichier)) {
      fs.unlinkSync(document.cheminFichier);
    }

    // Supprimer l'entrée en base
    await document.deleteOne();

    res.status(200).json({ message: 'Document supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Télécharger un document
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, utilisateur: req.user.id });

    if (!document) {
      return res.status(404).json({ message: 'Document introuvable.' });
    }

    res.download(path.resolve(document.cheminFichier), document.nomOriginal);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};// Recherche par mots-clés (recherche classique dans le texte)
exports.rechercherDocuments = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Veuillez fournir un terme de recherche.' });
    }

    const documents = await Document.find({
      utilisateur: req.user.id,
      $or: [
        { nomOriginal: { $regex: q, $options: 'i' } },
        { texteExtrait: { $regex: q, $options: 'i' } },
        { motsCles: { $regex: q, $options: 'i' } },
      ],
    }).select('nomOriginal typeDocument resume motsCles nombrePages dateUpload');

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
exports.getStats = async (req, res) => {
  try {
    const Conversation = require('../models/Conversation');

    const nombreDocuments = await Document.countDocuments({ utilisateur: req.user.id });
    const nombreConversations = await Conversation.countDocuments({ utilisateur: req.user.id });
    const documentsRecents = await Document.find({ utilisateur: req.user.id })
      .sort({ dateUpload: -1 })
      .limit(5)
      .select('nomOriginal typeDocument resume dateUpload');

    res.status(200).json({
      nombreDocuments,
      nombreConversations,
      nombreAnalyses: nombreDocuments, // chaque document uploadé = 1 analyse (résumé + mots-clés + type)
      documentsRecents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};