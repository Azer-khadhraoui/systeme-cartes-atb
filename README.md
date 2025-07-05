# 🏦 Système de Gestion des Cartes ATB

Un système moderne de gestion des cartes bancaires pour l'Arab Tunisian Bank (ATB), développé avec React et déployé sur GitHub Pages.

## 🚀 Démonstration en ligne

**[🔗 Voir la démo](https://azer-khadhraoui.github.io/systeme-cartes-atb/)**

## 📋 Description

Ce projet est une application web moderne qui permet aux employés de l'ATB de gérer efficacement les demandes de cartes bancaires et de consulter le stock disponible. L'interface respecte l'identité visuelle de la banque avec les couleurs officielles bordeaux et blanc.

## ✨ Fonctionnalités

### 🔐 Authentification
- **Connexion sécurisée** avec matricule et mot de passe
- **Inscription** avec validation complète des données
- **Indicateur de force du mot de passe** en temps réel
- **Validation des formulaires** avec messages d'erreur personnalisés

### 🎨 Interface Utilisateur
- **Design moderne** respectant l'identité visuelle ATB
- **Animations fluides** et effets visuels attractifs
- **Interface responsive** adaptée à tous les écrans
- **Dashboard spectaculaire** après connexion

### 📊 Fonctionnalités Métier
- **Nouvelle demande de cartes** avec attribution d'emplacement physique
- **Consultation du stock** avec statistiques détaillées
- **Suivi des demandes traitées** en temps réel
- **Alertes de stock** automatiques

## 🛠️ Technologies Utilisées

- **Frontend** : React 18, CSS3, HTML5
- **Deployment** : GitHub Pages
- **Build Tool** : Create React App
- **Version Control** : Git & GitHub
- **Package Manager** : npm

## 🎨 Design & UX

- **Couleurs ATB** : Bordeaux (#A51C30), Blanc, Gris
- **Typographie** : Segoe UI (système)
- **Animations** : CSS Animations & Transitions
- **Icons** : SVG personnalisés
- **Responsive** : Mobile-first approach

## 📦 Installation & Développement

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn
- Git

### Installation locale
```bash
# Cloner le repository
git clone https://github.com/Azer-khadhraoui/systeme-cartes-atb.git

# Accéder au dossier
cd systeme-cartes-atb

# Installer les dépendances
npm install

# Lancer en mode développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

### Build de production
```bash
# Créer un build optimisé
npm run build
```

## 🚀 Déploiement

Le projet est automatiquement déployé sur GitHub Pages. Pour déployer une nouvelle version :

```bash
# Méthode recommandée
npm run build
npx gh-pages -d build --dotfiles

# Ou utiliser le script npm
npm run deploy
```

## 📱 Captures d'écran

### Page de Connexion
- Interface de connexion moderne avec logo ATB
- Formulaire d'inscription avec validation avancée
- Indicateur de force du mot de passe

### Dashboard Principal
- En-tête personnalisé avec informations utilisateur
- Deux actions principales : Nouvelle demande et Stock
- Section statistiques avec données en temps réel
- Footer avec informations système

## 🏗️ Structure du Projet

```
systeme-cartes-atb/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── .nojekyll
├── src/
│   ├── App.js          # Composant principal
│   ├── App.css         # Styles globaux
│   ├── atb.png         # Logo ATB
│   └── index.js        # Point d'entrée
├── build/              # Build de production
└── README.md
```

## 🎯 Fonctionnalités Futures

- [ ] Intégration avec une API backend
- [ ] Système de notifications en temps réel
- [ ] Génération de rapports PDF
- [ ] Module d'administration avancé
- [ ] Support multilingue (Français/Arabe)
- [ ] Authentification à deux facteurs

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est développé pour l'Arab Tunisian Bank. Tous droits réservés.

## 👥 Équipe

- **Développeur Principal** : Azer Khadhraoui
- **Organisation** : Arab Tunisian Bank (ATB)

## 📞 Contact

Pour toute question ou suggestion concernant ce projet :

- **Email** : azerronaldo2004@gmail.com
- **GitHub** : [@Azer-khadhraoui](https://github.com/Azer-khadhraoui)

---

<div align="center">
  <img src="src/atb.png" alt="ATB Logo" width="60">
  <br>
  <strong>Arab Tunisian Bank - Système de Gestion des Cartes</strong>
  <br>
  <em>© 2025 Arab Tunisian Bank. Tous droits réservés.</em>
</div>
