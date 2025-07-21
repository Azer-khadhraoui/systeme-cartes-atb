const mysql = require('mysql2');
require('dotenv').config();

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1', // Utiliser IPv4 explicitement
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_cartes',
  port: process.env.DB_PORT || 3307,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig);

// Promisifier pour utiliser async/await
const promisePool = pool.promise();

// Fonction pour tester la connexion
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Connexion à la base de données MySQL réussie');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

module.exports = {
  pool: promisePool,
  testConnection
};
