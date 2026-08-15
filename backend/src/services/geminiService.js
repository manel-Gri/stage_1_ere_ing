const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

// Génère un résumé automatique du document
const genererResume = async (texte) => {
  try {
    const prompt = `Résume le document suivant en français, en 3 à 5 phrases claires et concises. Ne réponds qu'avec le résumé, sans phrase d'introduction.\n\nDocument :\n${texte.slice(0, 15000)}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Erreur génération résumé :', error.message);
    return '';
  }
};

// Extrait les mots-clés principaux
const extraireMotsCles = async (texte) => {
  try {
    const prompt = `Extrait les 5 à 10 mots-clés les plus importants du document suivant. Réponds uniquement avec une liste de mots-clés séparés par des virgules, 
    sans phrase d'introduction ni numérotation.\n\nDocument :\n${texte.slice(0, 150000)}`;

    const result = await model.generateContent(prompt);
    const texteReponse = result.response.text().trim();
    return texteReponse.split(',').map((mot) => mot.trim()).filter(Boolean);
  } catch (error) {
    console.error('Erreur extraction mots-clés :', error.message);
    return [];
  }
};

// Identifie le type de document
const identifierTypeDocument = async (texte) => {
  try {
    const prompt = `Identifie le type de ce document parmi les catégories suivantes : Facture, Contrat, CV, Rapport, Lettre, Autre. Réponds uniquement avec un seul mot correspondant à la catégorie, sans explication.\n\nDocument :\n${texte.slice(0, 5000)}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Erreur identification type :', error.message);
    return 'Autre';
  }
};

module.exports = { genererResume, extraireMotsCles, identifierTypeDocument };