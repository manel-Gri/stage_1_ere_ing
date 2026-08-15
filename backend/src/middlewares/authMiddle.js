const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // Le token est envoyé dans le header : Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attacher l'utilisateur décodé à la requête
      req.user = decoded;

      next(); // on passe à la suite (le controller)
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Aucun token fourni, accès refusé.' });
  }
};

module.exports = protect;