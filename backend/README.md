# Backend - Système de Gestion des Cartes ATB

API Node.js avec Express et MySQL pour la gestion des employés ATB.

## 🚀 Installation et Configuration

### 1. Prérequis
- Node.js (version 14 ou supérieure)
- MySQL ou phpMyAdmin
- Base de données `gestion_cartes`

### 2. Installation des dépendances
```bash
npm install
```

### 3. Configuration de la base de données
Créez un fichier `.env` (déjà créé) avec vos paramètres MySQL :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestion_cartes
PORT=5000
```

### 4. Initialisation de la base de données
```bash
npm run setup
```
Cette commande créera automatiquement la table `employes` dans votre base de données.

### 5. Démarrage du serveur

**Mode développement (avec auto-reload) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## 📋 Endpoints API

### Health Check
- **GET** `/api/health` - Vérifier le statut de l'API

### Employés
- **POST** `/api/employees/register` - Inscrire un nouvel employé
- **POST** `/api/employees/login` - Connexion d'un employé
- **GET** `/api/employees` - Obtenir tous les employés
- **GET** `/api/employees/:matricule` - Obtenir un employé par matricule

## 📊 Structure de la base de données

### Table `employes`
```sql
CREATE TABLE employes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(6) UNIQUE NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    mdp TEXT NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔐 Validation des données

### Inscription (`/api/employees/register`)
```json
{
  "matricule": "123456",  // Exactement 6 chiffres
  "nom": "Dupont",        // 2-50 caractères, lettres uniquement
  "prenom": "Jean",       // 2-50 caractères, lettres uniquement
  "password": "motdepasse123" // Minimum 8 caractères
}
```

### Connexion (`/api/employees/login`)
```json
{
  "matricule": "123456",
  "password": "motdepasse123"
}
```

## 🛡️ Sécurité

- Mots de passe hashés avec bcrypt
- Validation stricte des données d'entrée
- CORS configuré pour le frontend
- Gestion des erreurs centralisée

## 🔧 Scripts disponibles

- `npm start` - Démarrer le serveur
- `npm run dev` - Démarrer en mode développement
- `npm run setup` - Configurer la base de données

## 🌐 Intégration Frontend

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (développement React)
- `https://azer-khadhraoui.github.io` (production GitHub Pages)

## 📁 Structure du projet

```
backend/
├── config/
│   └── database.js         # Configuration MySQL
├── controllers/
│   └── employeeController.js # Logique métier
├── models/
│   └── Employee.js         # Modèle de données
├── routes/
│   └── employees.js        # Routes API
├── .env                    # Variables d'environnement
├── package.json           # Dépendances
├── server.js              # Serveur principal
└── setup-database.js      # Configuration DB
```

## 🐛 Dépannage

### Problème de connexion MySQL
1. Vérifiez que MySQL est démarré
2. Vérifiez les paramètres dans `.env`
3. Assurez-vous que la base de données `gestion_cartes` existe

### Erreur de port
Si le port 5000 est occupé, modifiez `PORT` dans `.env`

## 📝 Logs

Le serveur affiche des logs détaillés pour :
- Requêtes HTTP reçues
- Erreurs de base de données
- Tentatives de connexion

## 🔄 Next Steps

1. ✅ Installer les dépendances
2. ✅ Configurer la base de données
3. ✅ Créer la table employes
4. 🔄 Tester les endpoints
5. 🔄 Intégrer avec le frontend React
