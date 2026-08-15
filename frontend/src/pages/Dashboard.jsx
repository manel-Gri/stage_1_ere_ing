import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const chargerStats = async () => {
      try {
        const res = await api.get('/documents/stats');
        setStats(res.data);
      } catch (err) {
        setErreur('Impossible de charger les statistiques.');
      }
    };

    chargerStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-background p-8">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Tableau de bord 🌸</h1>
          <div className="flex gap-3">
            <Link
              to="/documents"
              className="btn-bounce bg-lavender text-charcoal px-5 py-2 rounded-xl font-semibold hover:bg-lavender/80 transition"
            >
              Mes documents
            </Link>
            <Link
              to="/chat"
              className="btn-bounce bg-pink text-charcoal px-5 py-2 rounded-xl font-semibold hover:bg-pink/80 transition"
            >
              Agent IA
            </Link>
          <Link
              to="/historique"
              className="btn-bounce bg-lavender text-charcoal px-5 py-2 rounded-xl font-semibold hover:bg-lavender/80 transition"
            >
              Historique
            </Link>
            <Link
              to="/profil"
              className="btn-bounce bg-pink text-charcoal px-5 py-2 rounded-xl font-semibold hover:bg-pink/80 transition"
            >
              Mon profil
            </Link>
            <button
              onClick={handleLogout}
              className="btn-bounce bg-pink-deep text-white px-5 py-2 rounded-xl font-semibold hover:bg-pink-deep/90 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="auth-card bg-cream p-6 rounded-3xl shadow-xl mb-6">
          <p className="text-lg text-charcoal">
            Bienvenue, <span className="font-semibold">{user?.nom}</span> 👋
          </p>
          <p className="text-charcoal/60 mt-2">Email : {user?.email}</p>
        </div>

        {erreur && (
          <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-4 text-sm">
            {erreur}
          </div>
        )}

        {stats && (
          <>
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-cream p-5 rounded-2xl shadow-md text-center">
                <p className="text-3xl font-bold text-pink-deep">{stats.nombreDocuments}</p>
                <p className="text-charcoal/60 text-sm mt-1">Documents</p>
              </div>
              <div className="bg-cream p-5 rounded-2xl shadow-md text-center">
                <p className="text-3xl font-bold text-pink-deep">{stats.nombreAnalyses}</p>
                <p className="text-charcoal/60 text-sm mt-1">Analyses effectuées</p>
              </div>
              <div className="bg-cream p-5 rounded-2xl shadow-md text-center">
                <p className="text-3xl font-bold text-pink-deep">{stats.nombreConversations}</p>
                <p className="text-charcoal/60 text-sm mt-1">Conversations IA</p>
              </div>
            </div>

            {/* Documents récents */}
            <div className="bg-cream p-6 rounded-3xl shadow-xl">
              <h2 className="text-xl font-bold text-charcoal mb-4">Documents récents</h2>
              {stats.documentsRecents.length === 0 ? (
                <p className="text-charcoal/60 text-sm">Aucun document pour le moment.</p>
              ) : (
                <div className="space-y-3">
                  {stats.documentsRecents.map((doc) => (
                    <div key={doc._id} className="flex justify-between items-center border-b border-pink/20 pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-charcoal">{doc.nomOriginal}</p>
                        <p className="text-xs text-charcoal/50">{doc.typeDocument}</p>
                      </div>
                      <span className="text-xs text-charcoal/40">
                        {new Date(doc.dateUpload).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;