const { pool } = require('./config/database');

async function addIdColumnToCartes() {
  try {
    console.log('🔧 Modification de la structure de la table cartes...');
    
    // Supprimer la clé primaire existante sur CIN
    console.log('1️⃣ Suppression de la clé primaire existante...');
    await pool.execute('ALTER TABLE cartes DROP PRIMARY KEY');
    
    // Ajouter la colonne id comme première colonne
    console.log('2️⃣ Ajout de la colonne ID...');
    await pool.execute(`
      ALTER TABLE cartes 
      ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST
    `);
    
    // Ajouter un index sur CIN pour maintenir l'unicité
    console.log('3️⃣ Ajout d\'un index unique sur CIN et type...');
    await pool.execute('ALTER TABLE cartes ADD UNIQUE INDEX idx_cin_type (cin, type)');
    
    console.log('✅ Structure de la table modifiée avec succès !');
    
    // Vérifier le résultat
    const [structure] = await pool.execute('DESCRIBE cartes');
    console.log('\n📋 Nouvelle structure :');
    structure.forEach(column => {
      console.log(`  ${column.Field} - ${column.Type} - ${column.Key} - ${column.Extra}`);
    });
    
    const [rows] = await pool.execute('SELECT * FROM cartes');
    console.log('\n📊 Cartes avec IDs :');
    rows.forEach(carte => {
      console.log(`  ID: ${carte.id} - ${carte.prenom} ${carte.nom} - ${carte.type}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.message.includes('Duplicate')) {
      console.log('💡 Il semble y avoir des doublons CIN+type. Vérifions...');
      try {
        const [duplicates] = await pool.execute(`
          SELECT cin, type, COUNT(*) as count 
          FROM cartes 
          GROUP BY cin, type 
          HAVING count > 1
        `);
        if (duplicates.length > 0) {
          console.log('⚠️ Doublons trouvés :');
          duplicates.forEach(dup => {
            console.log(`  CIN: ${dup.cin}, Type: ${dup.type}, Count: ${dup.count}`);
          });
        }
      } catch (checkError) {
        console.error('Erreur lors de la vérification des doublons:', checkError.message);
      }
    }
  } finally {
    await pool.end();
  }
}

addIdColumnToCartes();
