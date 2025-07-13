const { pool } = require('./config/database');

async function addIdColumn() {
  try {
    console.log('🔧 Ajout de la colonne ID à la table cartes...');
    
    // Ajouter la colonne id comme clé primaire auto-incrémentée
    await pool.execute(`
      ALTER TABLE cartes 
      ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST
    `);
    
    console.log('✅ Colonne ID ajoutée avec succès !');
    
    // Vérifier le résultat
    const [rows] = await pool.execute('SELECT * FROM cartes');
    console.log('📊 Cartes avec IDs :');
    rows.forEach(carte => {
      console.log(`  ID: ${carte.id} - ${carte.prenom} ${carte.nom} - ${carte.type}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout de la colonne ID:', error.message);
  } finally {
    await pool.end();
  }
}

addIdColumn();
