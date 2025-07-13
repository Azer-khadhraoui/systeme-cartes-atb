const { pool } = require('./config/database');

async function checkTableStructure() {
  try {
    console.log('🔍 Vérification de la structure de la table cartes...');
    
    // Afficher la structure de la table
    const [structure] = await pool.execute('DESCRIBE cartes');
    console.log('📋 Structure de la table cartes :');
    structure.forEach(column => {
      console.log(`  ${column.Field} - ${column.Type} - ${column.Key} - ${column.Extra}`);
    });
    
    // Afficher quelques données avec tous les champs
    const [rows] = await pool.execute('SELECT * FROM cartes LIMIT 3');
    console.log('\n📊 Données actuelles :');
    rows.forEach(carte => {
      console.log(`  ${JSON.stringify(carte)}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

checkTableStructure();
