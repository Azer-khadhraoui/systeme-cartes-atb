// Script pour créer des employés de démonstration
const employees = [
  {
    nom: "Ben Ali",
    prenom: "Mohamed",
    matricule: "100001",
    password: "Password123!"
  },
  {
    nom: "Khadhraoui",
    prenom: "Salma",
    matricule: "100002", 
    password: "Password123!"
  },
  {
    nom: "Gharbi",
    prenom: "Ahmed",
    matricule: "100003",
    password: "Password123!"
  }
];

async function createEmployees() {
  console.log('🚀 Création des employés de démonstration...\n');
  
  for (const employee of employees) {
    try {
      const response = await fetch('http://localhost:5000/api/employees/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ ${employee.prenom} ${employee.nom} (${employee.matricule}) créé avec succès`);
      } else {
        console.log(`❌ Erreur pour ${employee.prenom} ${employee.nom}: ${result.message}`);
      }
    } catch (error) {
      console.log(`❌ Erreur de connexion pour ${employee.prenom} ${employee.nom}:`, error.message);
    }
  }
  
  console.log('\n🎯 Employés de test créés ! Vous pouvez maintenant tester la connexion avec :');
  console.log('- Matricule: 100001, Mot de passe: Password123!');
  console.log('- Matricule: 100002, Mot de passe: Password123!');
  console.log('- Matricule: 100003, Mot de passe: Password123!');
}

// Exécuter si le script est appelé directement
if (typeof window === 'undefined') {
  // Mode Node.js
  const fetch = require('node-fetch');
  createEmployees();
} else {
  // Mode navigateur - exporter la fonction
  window.createEmployees = createEmployees;
}
