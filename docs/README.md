# 🏗️ Architecture & Diagrammes - Système ATB

## 📁 Documentation Technique Complète

Ce dossier contient tous les diagrammes et analyses architecturales du **Système de Gestion des Cartes Bancaires ATB**.

### 📊 Contenu de la Documentation

| 📄 Document | 🎯 Objectif | 👥 Public Cible |
|-------------|-------------|------------------|
| **[📊 Diagramme de Classes](./diagramme-classe.md)** | Architecture technique détaillée | Développeurs, Architectes |
| **[👥 Diagramme de Cas d'Utilisation](./diagramme-utilisation.md)** | Fonctionnalités et workflows | Chef de projet, Analystes |

---

## 🎯 Vue d'Ensemble du Système

### **🏦 Contexte Métier**
- **Organisation** : Arab Tunisian Bank (ATB)
- **Domaine** : Gestion des cartes bancaires
- **Utilisateurs** : Employés ATB (guichetiers, conseillers)
- **Objectif** : Digitaliser et optimiser la gestion des demandes de cartes

### **💻 Stack Technique**
- **Frontend** : React 19.1.0 + CSS3
- **Backend** : Node.js + Express
- **Base de données** : MySQL 8.0+
- **Authentification** : bcrypt + localStorage
- **Documents** : jsPDF pour génération PDF
- **Version Control** : Git + Git LFS (pour vidéo démo)

### **📱 Fonctionnalités Clés**
- ✅ **CRUD complet** des demandes de cartes
- ✅ **Authentification sécurisée** avec "Se souvenir de moi"
- ✅ **12 types de cartes** bancaires supportés
- ✅ **Suivi des états** (en stock → en cours → délivrée)
- ✅ **Génération PDF** avec design ATB officiel
- ✅ **Interface responsive** mobile/desktop
- ✅ **Recherche et filtres** avancés
- ✅ **Statistiques temps réel**

---

## 📋 Structure des Diagrammes

### **📊 Diagramme de Classes**
- 🏗️ **Architecture MVC** détaillée
- 🔗 **Relations entre entités** (Employee, Carte)
- 🎛️ **Controllers** et API REST
- 🗄️ **Modèles de données** et validations
- ⚙️ **Services** (Auth, PDF, Validation)

### **👥 Diagramme de Cas d'Utilisation**
- 🎭 **Acteurs** : Employé ATB, Système
- 📋 **17 cas d'utilisation** détaillés
- 🔄 **Workflows** principaux avec séquences
- ✅ **Matrice de traçabilité** complète
- 🎬 **Démonstration** référencée (vidéo)

---

## 🎬 Démonstration Pratique

> 📹 **Vidéo de démonstration** : `atb_app.mp4` (95 Mo)
> 
> Cette vidéo montre **tous les diagrammes en action** :
> - Navigation dans les classes (composants React)
> - Exécution des cas d'utilisation complets
> - Workflows de bout en bout
> - Interface responsive sur différents devices

**🔗 Accès à la vidéo :**
- [📥 Téléchargement direct](https://github.com/Azer-khadhraoui/systeme-cartes-atb/raw/master/atb_app.mp4)
- [👀 Voir sur GitHub](https://github.com/Azer-khadhraoui/systeme-cartes-atb/blob/master/atb_app.mp4)
- 💻 Clone local : `git clone` puis lecture locale

---

## 🔍 Analyse Architecturale

### **🎯 Patterns Utilisés**
- **MVC** : Séparation Model-View-Controller
- **REST** : API standardisée avec verbes HTTP
- **SPA** : Single Page Application avec React
- **Repository** : Modèles avec accès base de données
- **Service Layer** : Logique métier séparée

### **✅ Bonnes Pratiques Appliquées**
- **Validation stricte** des données côté client et serveur
- **Hachage sécurisé** des mots de passe (bcrypt)
- **Prévention des doublons** métier (CIN + type carte)
- **Interface responsive** mobile-first
- **Génération automatique** de documents professionnels
- **Persistence intelligente** des préférences utilisateur

### **🚀 Scalabilité**
- **Architecture modulaire** facilement extensible
- **API REST** prête pour intégration externe
- **Base MySQL** optimisée avec index
- **Frontend React** componentisé
- **Documentation complète** pour maintenance

---

## 📊 Métriques du Projet

| 📈 Métrique | 🔢 Valeur | 📄 Description |
|-------------|-----------|----------------|
| **Lignes de code** | ~2500 | React + Node.js total |
| **Classes principales** | 8 | Employee, Carte, App, Controllers, Services |
| **Cas d'utilisation** | 17 | Tous les workflows métier |
| **Types de cartes** | 12 | Produits bancaires ATB |
| **Endpoints API** | 6 | Routes REST complètes |
| **Validations** | 15+ | Règles métier strictes |
| **Plateformes** | 3 | Desktop, Mobile, Tablet |

---

## 🤝 Utilisation de la Documentation

### **👨‍💻 Pour les Développeurs**
1. Consultez le **[Diagramme de Classes](./diagramme-classe.md)** pour comprendre l'architecture
2. Référez-vous aux **modèles de données** pour les modifications
3. Utilisez les **patterns** identifiés pour les nouvelles fonctionnalités

### **📋 Pour les Chefs de Projet**
1. Étudiez le **[Diagramme de Cas d'Utilisation](./diagramme-utilisation.md)** pour les fonctionnalités
2. Consultez la **matrice de traçabilité** pour le suivi
3. Référencez la **vidéo de démonstration** pour les présentations

### **🎯 Pour les Analystes Métier**
1. Analysez les **workflows** pour comprendre les processus
2. Validez les **règles métier** dans les cas d'utilisation
3. Vérifiez les **validations** implémentées

---

<div align="center">
  <strong>🏦 Arab Tunisian Bank - Documentation Technique</strong>
  <br>
  <em>Architecture • Diagrammes • Workflows • Bonnes Pratiques</em>
  <br><br>
  <sub>Version 2.0 • Mise à jour Juillet 2025</sub>
</div>
