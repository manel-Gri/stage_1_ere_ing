const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const { pdf } = require('pdf-to-img');

// OCR sur un PDF scanné : convertit chaque page en image puis extrait le texte
const ocrSurPDF = async (cheminFichier) => {
  let texteComplet = '';
  let nombrePages = 0;

  const document = await pdf(cheminFichier, { scale: 2 });

  for await (const image of document) {
    nombrePages++;
    const { data } = await Tesseract.recognize(image, 'fra+eng');
    texteComplet += data.text + '\n\n';
  }

  return { texte: texteComplet.trim(), nombrePages };
};

const extraireTexte = async (cheminFichier, typeFichier) => {
  try {
    if (typeFichier === 'application/pdf') {
      const dataBuffer = fs.readFileSync(cheminFichier);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      const nombrePages = result.pages?.length || result.total || 0;

      // Si le texte extrait est trop court, c'est probablement un PDF scanné → on bascule sur l'OCR
      if (!result.text || result.text.trim().length < 200) {
        console.log('📷 PDF scanné détecté, lancement de l\'OCR...');
        return await ocrSurPDF(cheminFichier);
      }

      return { texte: result.text, nombrePages };
    }

    if (typeFichier === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: cheminFichier });
      return { texte: result.value, nombrePages: 0 };
    }

    if (typeFichier === 'text/plain') {
      const texte = fs.readFileSync(cheminFichier, 'utf-8');
      return { texte, nombrePages: 0 };
    }

    if (typeFichier === 'image/png' || typeFichier === 'image/jpeg') {
      const { data } = await Tesseract.recognize(cheminFichier, 'fra+eng');
      return { texte: data.text, nombrePages: 1 };
    }

    return { texte: '', nombrePages: 0 };
  } catch (error) {
    console.error('Erreur extraction texte :', error.message);
    return { texte: '', nombrePages: 0 };
  }
};

module.exports = { extraireTexte };