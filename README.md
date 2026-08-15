\# 🤖 Agent IA pour l'Automatisation Documentaire



Plateforme Web SaaS full stack intégrant un pipeline RAG (Retrieval-Augmented Generation) et un agent conversationnel intelligent, capable d'analyser, indexer et interroger automatiquement des documents d'entreprise.



Projet réalisé dans le cadre d'un stage d'été 2026 chez \*\*AIKUP\*\*.



\## ✨ Fonctionnalités



\- 🔐 Authentification sécurisée (JWT)

\- 📄 Gestion documentaire (upload, suppression, téléchargement) — PDF, DOCX, TXT, images

\- 🔍 Analyse automatique : extraction de texte, résumé, mots-clés, type de document, OCR

\- 💬 Agent IA conversationnel basé sur un pipeline RAG (réponses uniquement à partir des documents)

\- 🔎 Recherche sémantique et recherche par mots-clés

\- 📊 Tableau de bord avec statistiques

\- 🕓 Historique des conversations et analyses



\## 🛠️ Stack technique



| Catégorie | Technologies |

|---|---|

| Frontend | React.js, React Router, Axios, Tailwind CSS v4 |

| Backend | Node.js, Express.js, JWT, Multer |

| Base de données | MongoDB Atlas |

| Intelligence Artificielle | Google Gemini API, RAG (embeddings + MongoDB), Tesseract.js (OCR) |



\## 📋 Prérequis



\- Node.js v18+ et npm

\- Un compte MongoDB Atlas (gratuit)

\- Une clé API Google Gemini (gratuite via \[Google AI Studio](https://aistudio.google.com))



\## 🚀 Installation



\### 1. Cloner le projet



\\`\\`\\`bash

git clone https://github.com/TON\_NOM\_UTILISATEUR/agent-ia-documentaire.git

cd agent-ia-documentaire

\\`\\`\\`



\### 2. Configurer le backend



\\`\\`\\`bash

cd backend

npm install

\\`\\`\\`



Créer un fichier `.env` dans le dossier `backend` avec le contenu suivant :



\\`\\`\\`env

PORT=5000

MONGO\_URI=mongodb+srv://<utilisateur>:<mot\_de\_passe>@<cluster>.mongodb.net/agent-ia-doc?retryWrites=true\&w=majority

JWT\_SECRET=votre\_secret\_jwt

GEMINI\_API\_KEY=votre\_cle\_api\_gemini

\\`\\`\\`



Lancer le serveur backend :



\\`\\`\\`bash

npm run dev

\\`\\`\\`



Le serveur démarre sur `http://localhost:5000`.



\### 3. Configurer le frontend



Dans un nouveau terminal :



\\`\\`\\`bash

cd frontend

npm install

npm run dev

\\`\\`\\`



L'application est accessible sur `http://localhost:5173`.



\## 📁 Structure du projet



\\`\\`\\`

agent-ia-documentaire/

├── backend/

│   ├── src/

│   │   ├── config/          # Configuration (Multer)

│   │   ├── controllers/     # Logique métier

│   │   ├── middlewares/     # Authentification JWT

│   │   ├── models/          # Modèles Mongoose

│   │   ├── routes/          # Routes API

│   │   ├── services/        # Services (extraction, IA, RAG)

│   │   └── server.js        # Point d'entrée

│   └── uploads/              # Fichiers uploadés (non versionné)

├── frontend/

│   └── src/

│       ├── pages/            # Pages de l'application

│       ├── components/       # Composants réutilisables

│       ├── context/           # Contexte d'authentification

│       └── services/          # Appels API (Axios)

└── README.md

\\`\\`\\`



\## 📡 API — Endpoints principaux



\### Authentification

| Méthode | Route | Description |

|---|---|---|

| POST | `/api/auth/register` | Créer un compte |

| POST | `/api/auth/login` | Se connecter |

| GET | `/api/auth/me` | Profil utilisateur (protégé) |

| PUT | `/api/auth/me` | Modifier le profil (protégé) |

| PUT | `/api/auth/change-password` | Changer le mot de passe (protégé) |



\### Documents

| Méthode | Route | Description |

|---|---|---|

| POST | `/api/documents` | Uploader un document (protégé) |

| GET | `/api/documents` | Liste des documents (protégé) |

| GET | `/api/documents/stats` | Statistiques (protégé) |

| GET | `/api/documents/recherche?q=` | Recherche par mots-clés (protégé) |

| DELETE | `/api/documents/:id` | Supprimer un document (protégé) |

| GET | `/api/documents/:id/download` | Télécharger un document (protégé) |



\### Chat IA

| Méthode | Route | Description |

|---|---|---|

| POST | `/api/chat` | Poser une question à l'agent IA (protégé) |

| GET | `/api/chat/historique` | Historique des conversations (protégé) |



> Toutes les routes protégées nécessitent un header `Authorization: Bearer <token>`.



\## ⚠️ Limitations connues



\- La question globale type "résume tous mes documents" peut privilégier les documents dont le contenu est sémantiquement le plus proche de la question, plutôt qu'un résumé équilibré de chaque document (limitation classique des systèmes RAG orientés recherche par similarité).

\- L'OCR sur PDF scannés volumineux peut prendre plusieurs dizaines de secondes selon le nombre de pages.



\## 👤 Auteur



\*\*Manel Griri\*\* — Étudiante en 1ère année Cycle Ingénieur, ISSAT Sousse

Stage réalisé chez \*\*AIKUP\*\* — Encadrant : Mourad Hamdi



\## 📄 Licence



Projet académique réalisé dans le cadre d'un stage de fin d'année.

