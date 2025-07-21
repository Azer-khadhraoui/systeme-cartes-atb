const mysql = require('mysql2/promise');

async function recreateDatabase() {
  let connection;
  
  try {
    console.log('🔧 Début de la recréation de la base de données...');
    
    // Connexion à MySQL (sans spécifier de base de données)
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '', // Mot de passe vide par défaut pour XAMPP
      port: 3307
    });
    
    console.log('✅ Connexion à MySQL réussie');
    
    // Supprimer la base si elle existe et la recréer
    await connection.execute('DROP DATABASE IF EXISTS gestion_cartes');
    console.log('🗑️ Ancienne base de données supprimée (si elle existait)');
    
    await connection.execute('CREATE DATABASE gestion_cartes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Base de données "gestion_cartes" créée');
    
    // Se connecter à la nouvelle base
    await connection.changeUser({database: 'gestion_cartes'});
    console.log('✅ Connexion à la base "gestion_cartes"');
    
    // Créer la table des employés
    const createEmployeesTable = `
      CREATE TABLE employes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matricule VARCHAR(6) UNIQUE NOT NULL,
        nom VARCHAR(50) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        mdp TEXT NOT NULL,
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createEmployeesTable);
    console.log('✅ Table "employes" créée');
    
    // Créer la table des cartes
    const createCartesTable = `
      CREATE TABLE cartes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(50) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        cin VARCHAR(8) NOT NULL,
        type VARCHAR(100) NOT NULL,
        numCompte VARCHAR(20) NOT NULL,
        emp VARCHAR(10) NOT NULL,
        date DATE NOT NULL,
        etat ENUM('en_stock', 'en_cours', 'delivree') DEFAULT 'en_stock',
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_cin_type (cin, type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.execute(createCartesTable);
    console.log('✅ Table "cartes" créée');
    
    // Créer un employé de test
    const bcrypt = require('bcryptjs');
    const testPassword = await bcrypt.hash('admin123', 10);
    
    const insertTestEmployee = `
      INSERT INTO employes (matricule, nom, prenom, mdp) 
      VALUES ('123456', 'Admin', 'ATB', ?)
    `;
    
    await connection.execute(insertTestEmployee, [testPassword]);
    console.log('✅ Employé de test créé (Matricule: 123456, Mot de passe: admin123)');
    
    // Créer quelques cartes de test
    const insertTestCartes = `
      INSERT INTO cartes (nom, prenom, cin, type, numCompte, emp, date, etat) VALUES
      ('Dupont', 'Jean', '12345678', 'Visa Electron Debit', '1234567890123456', 'A1', CURDATE(), 'en_stock'),
      ('Martin', 'Marie', '87654321', 'Mastercard', '6543210987654321', 'B2', CURDATE(), 'en_cours'),
      ('Dubois', 'Pierre', '11223344', 'VISA Gold', '9876543210123456', 'C3', CURDATE(), 'delivree')
    `;
    
    await connection.execute(insertTestCartes);
    console.log('✅ Cartes de test créées');
    
    console.log('\n🎉 Base de données recréée avec succès !');
    console.log('\n📋 Informations de connexion :');
    console.log('   - Employé de test : Matricule 123456, Mot de passe admin123');
    console.log('   - 3 cartes de test ajoutées');
    console.log('\n🚀 Vous pouvez maintenant démarrer votre application !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la recréation de la base de données:', error.message);
    console.log('\n🔧 Solutions possibles :');
    console.log('   1. Vérifiez que XAMPP MySQL est démarré');
    console.log('   2. Vérifiez que le port 3306 est libre');
    console.log('   3. Vérifiez les paramètres de connexion MySQL');
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connexion fermée');
    }
  }
}

// Exécuter le script
recreateDatabase();
