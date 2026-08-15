const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chunk = require('../models/Chunk');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

// Découpe un texte en morceaux (chunks)
const decouperTexte = (texte, tailleChunk = 10000000, chevauchement = 100000) => {
  const chunks = [];
  let debut = 0;

  while (debut < texte.length) {
    const fin = Math.min(debut + tailleChunk, texte.length);
    chunks.push(texte.slice(debut, fin));
    debut += tailleChunk - chevauchement;
  }

  return chunks.filter((c) => c.trim().length > 20); // ignore les chunks trop petits
};

// Génère l'embedding (vecteur) d'un texte
const genererEmbedding = async (texte) => {
  const result = await embeddingModel.embedContent(texte, {
    outputDimensionality: 768,
  });
  return result.embedding.values;
};

// Traite un document complet : découpe + vectorise + sauvegarde tous les chunks
const indexerDocument = async (documentId, utilisateurId, texte) => {
  try {
    const chunks = decouperTexte(texte);

    for (const chunkTexte of chunks) {
      const embedding = await genererEmbedding(chunkTexte);
      await Chunk.create({
        document: documentId,
        utilisateur: utilisateurId,
        texte: chunkTexte,
        embedding,
      });
    }

    return chunks.length;
  } catch (error) {
    console.error('Erreur indexation document :', error.message);
    return 0;
  }
};
// Calcule la similarité cosinus entre deux vecteurs
const similariteCosinus = (vecA, vecB) => {
  const produitScalaire = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const normeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const normeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return produitScalaire / (normeA * normeB);
};

// Recherche les chunks les plus pertinents pour une question donnée
const rechercherChunksPertinents = async (question, utilisateurId, limite = 5) => {
  const embeddingQuestion = await genererEmbedding(question);

  const tousLesChunks = await Chunk.find({ utilisateur: utilisateurId }).populate('document', 'nomOriginal');

  const chunksAvecScore = tousLesChunks.map((chunk) => ({
    texte: chunk.texte,
    nomDocument: chunk.document?.nomOriginal || 'Document inconnu',
    score: similariteCosinus(embeddingQuestion, chunk.embedding),
  }));

  chunksAvecScore.sort((a, b) => b.score - a.score);

  return chunksAvecScore.slice(0, limite);
};

module.exports = { decouperTexte, genererEmbedding, indexerDocument, rechercherChunksPertinents };
