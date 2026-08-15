import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profil = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nom, setNom] = useState(user?.nom || '');
  const [email, setEmail] = useState(user?.email || '');
  const [messageProfil, setMessageProfil] = useState('');
  const [erreurProfil, setErreurProfil] = useState('');

  const [ancienMotDePasse, setAncienMotDePasse] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [messageMdp, setMessageMdp] = useState('');
  const [erreurMdp, setErreurMdp] = useState('');

  const handleUpdateProfil = async (e) => {
    e.preventDefault();
    setMessageProfil('');
    setErreurProfil('');
    try {
      await api.put('/auth/me', { nom, email });
      setMessageProfil('Profil mis à jour avec succès ✅');
    } catch (err) {
      setErreurProfil(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessageMdp('');
    setErreurMdp('');
    try {
      await api.put('/auth/change-password', { ancienMotDePasse, nouveauMotDePasse });
      setMessageMdp('Mot de passe modifié avec succès ✅');
      setAncienMotDePasse('');
      setNouveauMotDePasse('');
    } catch (err) {
      setErreurMdp(err.response?.data?.message || 'Erreur lors du changement de mot de passe.');
    }
  };

  return (
    <div className="auth-background p-8">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      <div className="relative max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="text-charcoal/60 hover:text-pink-deep transition">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-charcoal">Mon profil 🌷</h1>
        </div>

        {/* Formulaire modification profil */}
        <div className="auth-card bg-cream p-6 rounded-3xl shadow-xl mb-6">
          <h2 className="text-xl font-bold text-charcoal mb-4">Informations personnelles</h2>

          {messageProfil && (
            <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-xl mb-4 text-sm">
              {messageProfil}
            </div>
          )}
          {erreurProfil && (
            <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-4 text-sm">
              {erreurProfil}
            </div>
          )}

          <form onSubmit={handleUpdateProfil} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-charcoal">Nom</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full border-2 border-pink/50 rounded-xl px-4 py-2 focus:outline-none focus:border-pink-deep transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-charcoal">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-pink/50 rounded-xl px-4 py-2 focus:outline-none focus:border-pink-deep transition"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-bounce bg-pink-deep text-white px-5 py-2 rounded-xl font-semibold hover:bg-pink-deep/90 transition"
            >
              Enregistrer
            </button>
          </form>
        </div>

        {/* Formulaire changement mot de passe */}
        <div className="auth-card bg-cream p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold text-charcoal mb-4">Changer le mot de passe</h2>

          {messageMdp && (
            <div className="bg-green-100 text-green-700 border border-green-300 p-3 rounded-xl mb-4 text-sm">
              {messageMdp}
            </div>
          )}
          {erreurMdp && (
            <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-4 text-sm">
              {erreurMdp}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-charcoal">Mot de passe actuel</label>
              <input
                type="password"
                value={ancienMotDePasse}
                onChange={(e) => setAncienMotDePasse(e.target.value)}
                className="w-full border-2 border-pink/50 rounded-xl px-4 py-2 focus:outline-none focus:border-pink-deep transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-charcoal">Nouveau mot de passe</label>
              <input
                type="password"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
                className="w-full border-2 border-pink/50 rounded-xl px-4 py-2 focus:outline-none focus:border-pink-deep transition"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-bounce bg-pink-deep text-white px-5 py-2 rounded-xl font-semibold hover:bg-pink-deep/90 transition"
            >
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profil;