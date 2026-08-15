const User = require('../models/Utilisateur');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const genererToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Inscription
exports.register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      email,
      password: passwordHash,
    });

    // Générer le token
    const token = genererToken(user._id);

    res.status(201).json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const motDePasseValide = await bcrypt.compare(password, user.password);
    if (!motDePasseValide) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    }

    // Générer le token
    const token = genererToken(user._id);

    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
// Modifier le profil (nom / email)
exports.updateProfile = async (req, res) => {
  try {
    const { nom, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    if (nom) user.nom = nom;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      _id: user._id,
      nom: user.nom,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Vérifier l'ancien mot de passe
    const motDePasseValide = await bcrypt.compare(ancienMotDePasse, user.password);
    if (!motDePasseValide) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect.' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(nouveauMotDePasse, salt);

    await user.save();

    res.status(200).json({ message: 'Mot de passe modifié avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};