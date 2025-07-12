const { pool } = require('./config/database');
const bcrypt = require('bcrypt');

const testAuth = async () => {
  try {
    // Récupérer l'employé de la base
    const [rows] = await pool.execute('SELECT * FROM employes WHERE matricule = ?', [123456]);
    
    if (rows.length === 0) {
      console.log('❌ Aucun employé trouvé avec le matricule 123456');
      return;
    }

    const employee = rows[0];
    console.log('✅ Employé trouvé:', {
      matricule: employee.matricule,
      nom: employee.nom,
      prenom: employee.prenom,
      mdp_length: employee.mdp.length
    });

    // Tester le mot de passe
    const testPassword = 'TestPassword123!';
    const isValid = await bcrypt.compare(testPassword, employee.mdp);
    
    console.log('🔐 Test du mot de passe:', isValid ? '✅ Valide' : '❌ Invalide');
    
    // Tester aussi avec bcrypt.hash pour voir le format
    const testHash = await bcrypt.hash(testPassword, 10);
    console.log('🔨 Hash de test généré:', testHash.length, 'caractères');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await pool.end();
  }
};

testAuth();
