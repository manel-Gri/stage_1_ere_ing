import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Historique = () => {
  const [conversations, setConversations] = useState([]);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const chargerHistorique = async () => {
      try {
        const res = await api.get('/chat/historique');
        setConversations(res.data);
      } catch (err) {
        setErreur('Impossible de charger l\'historique.');
      } finally {
        setChargement(false);
      }
    };

    chargerHistorique();
  }, []);

  const formaterDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="auth-background p-8">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="text-charcoal/60 hover:text-pink-deep transition">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-charcoal">Historique 🕓</h1>
        </div>

        {erreur && (
          <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-4 text-sm">
            {erreur}
          </div>
        )}

        {chargement && (
          <p className="text-center text-charcoal/60">Chargement...</p>
        )}

        {!chargement && conversations.length === 0 && (
          <p className="text-center text-charcoal/60">Aucune conversation pour le moment.</p>
        )}

        <div className="space-y-4">
          {conversations.map((conv) => (
            <div key={conv._id} className="auth-card bg-cream p-5 rounded-2xl shadow-md">
              <p className="text-xs text-charcoal/50 mb-2">{formaterDate(conv.dateCreation)}</p>

              <div className="mb-3">
                <p className="text-xs font-semibold text-pink-deep mb-1">Question</p>
                <p className="text-charcoal">{conv.question}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-pink-deep mb-1">Réponse</p>
                <p className="text-charcoal/80 whitespace-pre-wrap">{conv.reponse}</p>
              </div>

              {conv.sources?.length > 0 && (
                <p className="text-xs text-charcoal/50 mt-3">
                  📎 Sources : {conv.sources.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Historique;