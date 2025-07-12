const { pool } = require('./config/database');

const createEmployeesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS employes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      matricule VARCHAR(6) UNIQUE NOT NULL,
      nom VARCHAR(50) NOT NULL,
      prenom VARCHAR(50) NOT NULL,
      mdp TEXT NOT NULL,
      date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_matricule (matricule)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    console.log('🔄 Création de la table "employes"...');
    await pool.execute(createTableQuery);
    console.log('✅ Table "employes" créée avec succès');

    // Vérifier la structure de la table
    const [columns] = await pool.execute('DESCRIBE employes');
    console.log('\n📋 Structure de la table:');
    console.table(columns);

  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error.message);
    throw error;
  }
};

const checkDatabaseConnection = async () => {
  try {
    console.log('🔄 Test de connexion à la base de données...');
    const [result] = await pool.execute('SELECT 1 as test');
    console.log('✅ Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    return false;
  }
};

const setupDatabase = async () => {
  try {
    console.log('🚀 Initialisation de la base de données...\n');

    // Vérifier la connexion
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('❌ Impossible de se connecter à la base de données');
      process.exit(1);
    }

    // Créer la table
    await createEmployeesTable();

    console.log('\n✅ Configuration de la base de données terminée avec succès!');
    console.log('🎯 Vous pouvez maintenant démarrer le serveur avec: npm start');

  } catch (error) {
    console.error('\n❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  } finally {
    // Fermer la connexion
    await pool.end();
    console.log('🔌 Connexion fermée');
  }
};

// Exécuter la configuration si le script est appelé directement
if (require.main === module) {
  setupDatabase();
}

module.exports = {
  createEmployeesTable,
  checkDatabaseConnection,
  setupDatabase
};
