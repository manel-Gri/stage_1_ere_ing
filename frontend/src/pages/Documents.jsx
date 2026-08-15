import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Documents = () => {
  const { logout } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [fichier, setFichier] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [recherche, setRecherche] = useState('');
  const [modeRecherche, setModeRecherche] = useState(false);

  // Charger la liste des documents au chargement de la page
  const chargerDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (err) {
      setErreur('Impossible de charger les documents.');
    }
  };
  const handleRecherche = async (e) => {
    e.preventDefault();
    if (!recherche.trim()) {
      setModeRecherche(false);
      chargerDocuments();
      return;
    }

    try {
      const res = await api.get(`/documents/recherche?q=${encodeURIComponent(recherche)}`);
      setDocuments(res.data);
      setModeRecherche(true);
    } catch (err) {
      setErreur('Erreur lors de la recherche.');
    }
  };

  const reinitialiserRecherche = () => {
    setRecherche('');
    setModeRecherche(false);
    chargerDocuments();
  };

  useEffect(() => {
    chargerDocuments();
  }, []);

  const handleFileChange = (e) => {
    setFichier(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fichier) return;

    setErreur('');
    setUploading(true);

    const formData = new FormData();
    formData.append('document', fichier);

    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFichier(null);
      document.getElementById('fileInput').value = '';
      chargerDocuments();
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    try {
      await api.delete(`/documents/${id}`);
      chargerDocuments();
    } catch (err) {
      setErreur('Erreur lors de la suppression.');
    }
  };

  const handleDownload = async (id, nomOriginal) => {
    try {
      const res = await api.get(`/documents/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nomOriginal);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setErreur('Erreur lors du téléchargement.');
    }
  };

  return (
    <div className="auth-background p-8">
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="text-charcoal/60 hover:text-pink-deep transition">
            ←
          </Link>
          <h1 className="text-3xl font-bold text-charcoal">Mes documents 📄</h1>
        </div>
        {erreur && (
          <div className="bg-pink-deep/20 text-pink-deep border border-pink-deep/30 p-3 rounded-xl mb-4 text-sm">
            {erreur}
          </div>
        )}

        {/* Barre de recherche */}
        <form onSubmit={handleRecherche} className="flex gap-3 mb-4">
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un document (nom, contenu, mots-clés)..."
            className="flex-1 border-2 border-pink/50 rounded-xl px-4 py-2 focus:outline-none focus:border-pink-deep transition bg-cream"
          />
          <button
            type="submit"
            className="btn-bounce bg-lavender text-charcoal px-5 py-2 rounded-xl font-semibold hover:bg-lavender/80 transition"
          >
            Rechercher
          </button>
          {modeRecherche && (
            <button
              type="button"
              onClick={reinitialiserRecherche}
              className="btn-bounce bg-charcoal/10 text-charcoal px-5 py-2 rounded-xl font-semibold hover:bg-charcoal/20 transition"
            >
              Réinitialiser
            </button>
          )}
        </form>

        {/* Formulaire d'upload */}
        <form onSubmit={handleUpload} className="auth-card bg-cream p-6 rounded-3xl shadow-xl mb-6 flex items-center gap-4">
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="flex-1 text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-pink file:text-charcoal file:font-medium hover:file:bg-pink-deep/30"
          />
          <button
            type="submit"
            disabled={!fichier || uploading}
            className="btn-bounce bg-pink-deep text-white px-5 py-2 rounded-xl font-semibold hover:bg-pink-deep/90 transition disabled:opacity-50"
          >
            {uploading ? 'Envoi...' : 'Uploader'}
          </button>
        </form>

        {/* Liste des documents */}
        <div className="space-y-4">
          {documents.length === 0 && (
            <p className="text-center text-charcoal/60">Aucun document pour le moment.</p>
          )}

          {documents.map((doc) => (
            <div key={doc._id} className="bg-cream p-5 rounded-2xl shadow-md">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-charcoal">{doc.nomOriginal}</h3>
                <span className="text-xs bg-lavender text-charcoal px-2 py-1 rounded-full">
                  {doc.typeDocument}
                </span>
              </div>

              {doc.resume && (
                <p className="text-sm text-charcoal/70 mb-2">{doc.resume}</p>
              )}

              {doc.motsCles?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.motsCles.map((mot, i) => (
                    <span key={i} className="text-xs bg-pink/50 text-charcoal px-2 py-0.5 rounded-full">
                      {mot}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-charcoal/50">
                <span>{doc.nombrePages > 0 ? `${doc.nombrePages} pages` : ''} · {(doc.taille / 1024).toFixed(0)} Ko</span>
                <div className="flex gap-3">
                  <button onClick={() => handleDownload(doc._id, doc.nomOriginal)} className="text-pink-deep font-medium hover:underline">
                    Télécharger
                  </button>
                  <button onClick={() => handleDelete(doc._id)} className="text-red-500 font-medium hover:underline">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documents;