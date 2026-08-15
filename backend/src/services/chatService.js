const { GoogleGenerativeAI } = require('@google/generative-ai');
const { rechercherChunksPertinents } = require('./ragService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

const repondreQuestion = async (question, utilisateurId) => {
  try {
    const chunksPertinents = await rechercherChunksPertinents(question, utilisateurId, 5);

    if (chunksPertinents.length === 0) {
      return {
        reponse: "Je n'ai trouvé aucun document pertinent pour répondre à votre question. Assurez-vous d'avoir uploadé des documents au préalable.",
        sources: [],
      };
    }

    const contexte = chunksPertinents
      .map((c, i) => `[Extrait ${i + 1} — ${c.nomDocument}]\n${c.texte}`)
      .join('\n\n');

    const prompt = `Tu es un assistant IA qui répond aux questions UNIQUEMENT à partir du contexte fourni ci-dessous, extrait des documents de l'utilisateur. Si la réponse ne se trouve pas dans le contexte, dis clairement que l'information n'est pas disponible dans les documents. Ne jamais inventer d'informations.

Contexte :
${contexte}

Question de l'utilisateur : ${question}

Réponds en français, de manière claire et concise.`;

    const result = await model.generateContent(prompt);
    const reponse = result.response.text().trim();

    const sources = [...new Set(chunksPertinents.map((c) => c.nomDocument))];

    return { reponse, sources };
  } catch (error) {
    console.error('Erreur chat IA :', error.message);
    return {
      reponse: "Une erreur s'est produite lors du traitement de votre question.",
      sources: [],
    };
  }
};

module.exports = { repondreQuestion };