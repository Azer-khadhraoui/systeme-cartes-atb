# 🏦 Système de Gestion des Cartes Bancaires ATB

> **Application web complète** de gestion des cartes bancaires pour l'Arab Tunisian Bank, avec interface moderne React et backend Node.js/Express/MySQL.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=flat-square&logo=mysql)](https://mysql.com/)
[![License](https://img.shields.io/badge/License-ATB_Private-A51C30?style=flat-square)](#)

## 🎯 Vue d'ensemble

Un système de gestion complet permettant aux employés de l'Arab Tunisian Bank de gérer efficacement :
- ✅ **Demandes de cartes bancaires** (12 types de cartes)
- ✅ **Stock et inventaire** avec localisation physique
- ✅ **Suivi des états** (en stock → en cours → délivrée)
- ✅ **Authentification sécurisée** avec "Se souvenir de moi"
- ✅ **Génération de PDF** professionnels
- ✅ **CRUD complet** avec validation avancée

## 🎬 Démonstration Vidéo

<div align="center">

### 📱 **Aperçu de l'Application ATB**

[![ATB Demo](https://img.shields.io/badge/🎥_VOIR_LA_DÉMO-Vidéo_Complète_95Mo-A51C30?style=for-the-badge&logo=play&logoColor=white)](https://github.com/Azer-khadhraoui/systeme-cartes-atb/blob/master/atb_app.mp4?raw=true)

**[📥 TÉLÉCHARGER LA VIDÉO (95 Mo)](https://github.com/Azer-khadhraoui/systeme-cartes-atb/raw/master/atb_app.mp4)**

</div>

> ⚠️ **Note GitHub :** En raison de la taille (95 Mo), la vidéo peut afficher "View raw" sur GitHub. Cliquez sur **"Download"** pour la télécharger directement.

**📹 Contenu de la démonstration :**
- ✨ **Interface utilisateur** moderne et responsive  
- 🔐 **Processus d'authentification** complet (connexion/inscription)
- 📋 **Création de demandes** de cartes bancaires
- 📊 **Gestion du stock** avec filtres et recherche avancés
- 📄 **Génération de PDF** professionnels avec design ATB
- 🎨 **Design ATB** avec animations fluides et responsive
- 🔄 **Fonctionnalité "Se souvenir de moi"** démonstrée

**📱 Plateformes démontrées :**
- 💻 **Desktop** : Navigation complète, toutes fonctionnalités
- 📱 **Mobile** : Interface responsive, touch-friendly  
- 🖥️ **Tablet** : Adaptation automatique de l'interface

### 📥 Options d'accès à la vidéo

<div align="center">

| 🎯 Méthode | 📄 Description | 🔗 Lien Direct |
|------------|-----------------|-----------------|
| **📥 Téléchargement rapide** | Download direct (recommandé) | **[⬇️ atb_app.mp4](https://github.com/Azer-khadhraoui/systeme-cartes-atb/raw/master/atb_app.mp4)** |
| **🌐 GitHub LFS** | Via interface GitHub | **[👀 Voir sur GitHub](https://github.com/Azer-khadhraoui/systeme-cartes-atb/blob/master/atb_app.mp4)** |
| **💻 Git Clone** | Accès local complet | `git clone` + lecture locale |

</div>

```bash
# 🚀 Méthode recommandée pour développeurs
git clone https://github.com/Azer-khadhraoui/systeme-cartes-atb.git
cd systeme-cartes-atb

# 📱 Lecture de la vidéo selon votre système
# Windows
start atb_app.mp4
# macOS  
open atb_app.mp4
# Linux
xdg-open atb_app.mp4
```

<!-- Lecteur vidéo pour les navigateurs qui supportent -->
<details>
<summary><strong>🎬 Tentative d'affichage intégré (peut ne pas fonctionner sur GitHub)</strong></summary>

<video width="100%" controls poster="src/atb.png">
  <source src="./atb_app.mp4" type="video/mp4">
  <p>🚫 Affichage impossible dans GitHub. Utilisez les liens de téléchargement ci-dessus.</p>
</video>

</details>

---

## ⚡ Fonctionnalités Principales

### 🔐 **Authentification & Sécurité**
- **Connexion sécurisée** avec matricule (6 chiffres) et mot de passe
- **Inscription d'employés** avec validation complète
- **"Se souvenir de moi"** : persistence des identifiants selon préférence
- **Déconnexion intelligente** : vide les champs seulement si non-persistant
- **Validation en temps réel** avec indicateur de force du mot de passe

### 💳 **Gestion des Cartes**
- **12 types de cartes** : Visa Electron, C'Jeune, Mastercard, VISA Gold, etc.
- **États de suivi** : En stock → En cours → Délivrée (avec couleurs distinctives)
- **Localisation physique** : Système d'emplacements (A1, B2, C10, etc.)
- **CRUD complet** : Créer, Consulter, Modifier, Supprimer
- **Validation stricte** : CIN (8 chiffres), N° compte (10-20 chiffres)

### 📊 **Dashboard & Analytics**
- **Statistiques en temps réel** : Total, en stock, en cours, délivrées
- **Recherche multicritères** : Nom, CIN, type, numéro de compte
- **Filtres avancés** : Par état, type de carte, période (7j, 30j, 90j, 1an)
- **Interface responsive** adaptée mobile/desktop
- **Feedback utilisateur** avec messages de succès/erreur

### 📄 **Génération de Documents**
- **PDF professionnel** avec design ATB officiel
- **Informations complètes** : Client, carte, emplacement, signature
- **Format standardisé** : En-tête ATB, sections organisées, footer légal
- **Nommage automatique** : `ATB_Carte_Type_Nom_Prénom_Date.pdf`

## 🏗️ Architecture Technique

### **Frontend** (React 19.1.0)
```
src/
├── App.js              # Composant principal avec toute la logique
├── App.css             # Styles ATB (bordeaux #A51C30)
├── atb.png             # Logo officiel ATB
└── index.js            # Point d'entrée
```

### **Backend** (Node.js + Express + MySQL)
```
backend/
├── server.js           # Serveur Express principal
├── config/
│   └── database.js     # Configuration MySQL
├── controllers/
│   ├── carteController.js     # CRUD cartes + statistiques
│   └── employeeController.js  # Authentification
├── models/
│   ├── Carte.js        # Modèle de données cartes
│   └── Employee.js     # Modèle employés
└── routes/
    ├── cartes.js       # Routes API cartes
    └── employees.js    # Routes API employés
```

### **Base de Données** (MySQL)
```sql
-- Table des employés
employes (id, nom, prenom, matricule, password)

-- Table des cartes  
cartes (id, nom, prenom, cin, numCompte, type, etat, date, emp)
```

## � Installation & Démarrage

### **Prérequis**
- Node.js 18+ & npm
- MySQL 8.0+
- Git

### **Installation Rapide**
```bash
# Cloner le repository
git clone https://github.com/Azer-khadhraoui/systeme-cartes-atb.git
cd systeme-cartes-atb

# 1. Configuration Backend
cd backend
npm install

# Configurer MySQL (créer base 'atb_cartes')
mysql -u root -p
CREATE DATABASE atb_cartes;

# Démarrer le backend (port 5000)
npm start

# 2. Configuration Frontend  
cd ../
npm install

# Démarrer le frontend (port 3000)
npm start
```

### **Accès Application**
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **Test localStorage** : `test-remember-me.html`
- **🎬 Démonstration** : Voir `atb_app.mp4` pour un guide complet d'utilisation

## 🎨 Interface & Design

### **Charte Graphique ATB**
- **Couleur principale** : Bordeaux #A51C30
- **Couleurs secondaires** : Blanc, Gris #666
- **Typographie** : Segoe UI, Arial
- **Logo** : ATB officiel intégré

### **États des Cartes**
- 🔵 **En stock** : Bleu (#2196F3)
- � **En cours** : Orange (#FF9800)  
- 🟢 **Délivrée** : Vert (#4CAF50)

### **Expérience Utilisateur**
- **Responsive design** mobile-first
- **Animations fluides** et transitions CSS
- **Validation en temps réel** avec feedback immédiat
- **Navigation intuitive** avec breadcrumbs

## 📋 Utilisation

> 🎬 **Voir la démonstration vidéo** `atb_app.mp4` pour un aperçu complet de toutes les fonctionnalités en action !

### **Workflow Standard**
1. **Connexion** employé avec matricule/mot de passe
2. **Nouvelle demande** : Saisie infos client + type carte + emplacement
3. **Consultation stock** : Liste avec filtres et recherche
4. **Modification état** : En stock → En cours → Délivrée
5. **Génération PDF** : Document officiel pour le client

> 📹 **Démonstration pratique :** Chaque étape est illustrée dans la vidéo de démonstration

### **Types de Cartes Supportés**
- Visa Electron Debit, C'Jeune, Visa Classique Nationale
- Mastercard, Virtuelle E-pay, Technologique (CTI)
- VISA Gold, Mastercard World, Moussafer Platinum
- American Express, Lella, El Khir

## 🔧 API Endpoints

### **Authentification**
```bash
POST /api/employees/register  # Inscription employé
POST /api/employees/login     # Connexion employé
```

### **Gestion Cartes**
```bash
GET    /api/cartes           # Liste toutes les cartes
POST   /api/cartes           # Créer nouvelle carte
PUT    /api/cartes/:id       # Modifier carte
DELETE /api/cartes/:id       # Supprimer carte
GET    /api/cartes/stats     # Statistiques
```

## 🧪 Tests & Validation

### **Tests Fonctionnels**
- ✅ CRUD complet cartes (Create, Read, Update, Delete)
- ✅ Authentification & "Se souvenir de moi"  
- ✅ Validation formulaires (CIN 8 chiffres, etc.)
- ✅ Génération PDF avec données correctes
- ✅ Filtres et recherche multicritères
- ✅ Responsive design mobile/desktop

### **Tests Techniques**
- ✅ Backend API (GET, POST, PUT, DELETE)
- ✅ Base de données MySQL (connexion, requêtes)
- ✅ Frontend React (composants, état, cycles)
- ✅ LocalStorage (persistence données)

## 🚀 Déploiement

### **Production**
```bash
# Build frontend optimisé
npm run build

# Déployer sur serveur
# Backend : PM2 ou Docker
# Frontend : Nginx ou Apache
# Base : MySQL en production
```

## 📊 Statistiques Projet

- **Lignes de code** : ~2500 (React + Node.js)
- **Composants** : 1 composant principal avec état complexe
- **Routes API** : 6 endpoints RESTful
- **Types de cartes** : 12 produits bancaires
- **Validations** : 15+ règles métier
- **Responsive** : Mobile/Tablet/Desktop
- **🎬 Démonstration** : Vidéo complète (95 Mo) `atb_app.mp4`

## 🤝 Contribution

### **Standards de Code**
- **ES6+** avec destructuring et arrow functions
- **Validation stricte** pour tous les inputs
- **Gestion d'erreurs** complète (try/catch)
- **Comments** en français pour la logique métier
- **Nomenclature** : camelCase (JS), kebab-case (CSS)

### **Process de Contribution**
1. Fork du repository
2. Branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commits descriptifs (`git commit -m "Ajout: validation CIN"`)
4. Push et Pull Request avec description détaillée

## � Support & Contact

**Développeur Principal** : Azer Khadhraoui  
**Email** : azerronaldo2004@gmail.com  
**GitHub** : [@Azer-khadhraoui](https://github.com/Azer-khadhraoui)  
**Organisation** : Arab Tunisian Bank  

## 📄 Licence

**Propriété privée** de l'Arab Tunisian Bank.  
Tous droits réservés © 2025 ATB.

---

<div align="center">
  <img src="src/atb.png" alt="ATB Logo" width="80">
  <br><br>
  <strong>🏦 Arab Tunisian Bank - Système de Gestion des Cartes Bancaires</strong>
  <br>
  <em>Application moderne • Interface React • API Node.js • Base MySQL</em>
  <br><br>
  <sub>Version 2.0 • Développé avec ❤️ pour ATB</sub>
</div>
