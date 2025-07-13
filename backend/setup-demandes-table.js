const { pool } = require('./config/database');

const createDemandesTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS demandes_cartes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom_client VARCHAR(50) NOT NULL,
      prenom_client VARCHAR(50) NOT NULL,
      cin VARCHAR(8) NOT NULL,
      num_compte VARCHAR(20) NOT NULL,
      type_carte VARCHAR(50) NOT NULL,
      date_demande DATE NOT NULL,
      emplacement VARCHAR(10) NOT NULL,
      etat ENUM('en_attente', 'en_cours', 'produite', 'delivree') DEFAULT 'en_attente',
      matricule_employe INT NOT NULL,
      date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_cin (cin),
      INDEX idx_matricule_employe (matricule_employe),
      INDEX idx_etat (etat),
      FOREIGN KEY (matricule_employe) REFERENCES employes(matricule)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    console.log('🔄 Création de la table "demandes_cartes"...');
    await pool.execute(createTableQuery);
    console.log('✅ Table "demandes_cartes" créée avec succès');

    // Vérifier la structure de la table
    const [columns] = await pool.execute('DESCRIBE demandes_cartes');
    console.log('\n📋 Structure de la table:');
    console.table(columns);

  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error.message);
    throw error;
  }
};

const setupDemandesTable = async () => {
  try {
    console.log('🚀 Initialisation de la table demandes_cartes...\n');

    // Créer la table
    await createDemandesTable();

    console.log('\n✅ Configuration de la table demandes_cartes terminée avec succès!');

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
  setupDemandesTable();
}

module.exports = {
  createDemandesTable,
  setupDemandesTable
};
