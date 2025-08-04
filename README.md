# ⚔️ Matchup Mentor

> **Analysez vos matchups League of Legends avec l'IA**

Une application web moderne qui utilise l'intelligence artificielle pour analyser les matchups entre champions dans League of Legends.

SOON : Analyse champion vs composition adverse

## ✨ Fonctionnalités

- 🔍 **Recherche de champions** avec barre de recherche interactive
- 🤖 **Analyse IA** avec Google Gemini pour des conseils personnalisés
- 🎨 **Interface moderne** avec design glassmorphism
- 📱 **Responsive** - fonctionne sur mobile et desktop
- 📊 **Données à jour** avec l'API Riot Games

## 🛠️ Technologies

- **Next.js** - Framework React
- **Tailwind CSS** - Styling moderne
- **Google Gemini AI** - Intelligence artificielle
- **Riot Games API** - Données League of Legends

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/matchup-mentor.git
cd matchup-mentor

# Installer les dépendances
npm install

# Configurer l'environnement
# Créer un fichier .env.local avec :
GOOGLE_AI_API_KEY=votre_clé_api_gemini

# Lancer le serveur
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📱 Utilisation

1. **Sélectionnez vos champions** avec la barre de recherche
2. **Cliquez sur "Analyser"**
3. **Recevez des conseils IA** personnalisés pour votre matchup

## 📁 Structure

```
matchup-mentor/
├── components/          # Composants React réutilisables
│   ├── ChampionSelect.js   # Dropdown de sélection avec recherche
│   ├── ResultDisplay.js   # Affichage des résultats IA
│   └── Loader.js          # Animation de chargement
├── pages/              # Pages Next.js
│   ├── api/              # API Routes
│   │   ├── champions.js    # Endpoint liste des champions
│   │   └── matchup.js      # Endpoint analyse IA
│   ├── _app.js           # Configuration globale Next.js
│   └── index.js          # Page d'accueil
├── styles/             # Fichiers de style
│   └── globals.css       # Styles globaux + Tailwind
├── public/             # Assets statiques
└── package.json        # Dépendances et scripts
```


