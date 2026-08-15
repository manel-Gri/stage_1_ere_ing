import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const finDesMessages = useRef(null);

  const scrollVersLeBas = () => {
    finDesMessages.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollVersLeBas();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || chargement) return;

    const questionActuelle = question;
    setQuestion('');
    setErreur('');

    // Ajoute immédiatement la question de l'utilisateur à l'affichage
    setMessages((prev) => [...prev, { role: 'user', texte: questionActuelle }]);
    setChargement(true);

    try {
      const res = await api.post('/chat', { question: questionActuelle });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', texte: res.data.reponse, sources: res.data.sources },
      ]);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la génération de la réponse.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-background p-8 flex flex-col h-screen">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      <div className="relative max-w-3xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/dashboard" className="text-charcoal/60 hover:text-pink-deep transition">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Agent IA 💬</h1>
        </div>

        {/* Zone des messages */}
        <div className="auth-card flex-1 bg-cream rounded-3xl shadow-xl p-6 overflow-y-auto mb-4 min-h-0">
          {messages.length === 0 && (
            <p className="text-center text-charcoal/50 mt-10">
              Pose une question sur tes documents 📄✨
            </p>
          )}

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-pink-deep text-white rounded-br-sm'
                      : 'bg-pink/40 text-charcoal rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.texte}</p>
                  {msg.sources?.length > 0 && (
                    <p className="text-xs mt-2 opacity-70">
                      📎 Sources : {msg.sources.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {chargement && (
              <div className="flex justify-start">
                <div className="bg-pink/40 text-charcoal px-4 py-3 rounded-2xl rounded-bl-sm">
                  <span className="animate-pulse">L'agent réfléchit...</span>
                </div>
              </div>
            )}
          </div>

          <div ref={finDesMessages}></div>
        </div>

        {erreur && (
          <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-3 text-sm">
            {erreur}
          </div>
        )}

        {/* Zone de saisie */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pose ta question..."
            className="flex-1 border-2 border-pink/50 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-deep transition bg-cream"
            disabled={chargement}
          />
          <button
            type="submit"
            disabled={chargement || !question.trim()}
            className="btn-bounce bg-pink-deep text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-deep/90 transition disabled:opacity-50"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;