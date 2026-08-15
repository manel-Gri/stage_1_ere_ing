import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de la connexion.');
    }
  };

  return (
    <div className="auth-background flex items-center justify-center p-4">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      <div className="auth-card relative bg-cream p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center text-charcoal">
          Bon retour 👋
        </h2>
        <p className="text-center text-charcoal/60 mb-6 text-sm">
          Connecte-toi à ton compte
        </p>

        {erreur && (
          <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-4 text-sm">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-pink/50 rounded-xl px-4 py-2 focus:outline-none focus:border-pink-deep transition"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-bounce w-full bg-pink-deep text-white py-2.5 rounded-xl font-semibold hover:bg-pink-deep/90 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-charcoal/70">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-pink-deep font-semibold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;