const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const nomUnique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, nomUnique);
  },
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const typesAutorises = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/png',
  'image/jpeg',
];

  if (typesAutorises.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés : PDF, DOCX, TXT.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10000 * 1024 * 1024 }, // 10 Mo max
});

module.exports = upload;