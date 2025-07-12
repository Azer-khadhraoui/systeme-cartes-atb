const Employee = require('../models/Employee');

// Contrôleur pour l'inscription d'un nouvel employé
const registerEmployee = async (req, res) => {
  try {
    const { nom, prenom, matricule, password } = req.body;

    // Validation des données
    if (!nom || !prenom || !matricule || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (nom, prenom, matricule, password)'
      });
    }

    // Validation du matricule (6 chiffres)
    const matriculeRegex = /^[0-9]{6}$/;
    if (!matriculeRegex.test(matricule)) {
      return res.status(400).json({
        success: false,
        message: 'Le matricule doit contenir exactement 6 chiffres'
      });
    }

    // Validation du nom et prénom (lettres, espaces, accents)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
    if (!nameRegex.test(nom) || !nameRegex.test(prenom)) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et le prénom doivent contenir entre 2 et 50 caractères (lettres uniquement)'
      });
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Créer l'employé
    const newEmployee = await Employee.create({
      matricule,
      nom: nom.trim(),
      prenom: prenom.trim(),
      password
    });

    res.status(201).json({
      success: true,
      message: 'Employé inscrit avec succès',
      data: {
        matricule: newEmployee.matricule,
        nom: newEmployee.nom,
        prenom: newEmployee.prenom
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error.message === 'Un employé avec ce matricule existe déjà') {
      return res.status(409).json({
        success: false,
        message: 'Ce matricule est déjà utilisé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour la connexion d'un employé
const loginEmployee = async (req, res) => {
  try {
    const { matricule, password } = req.body;

    // Validation des données
    if (!matricule || !password) {
      return res.status(400).json({
        success: false,
        message: 'Matricule et mot de passe requis'
      });
    }

    // Authentifier l'employé
    const employee = await Employee.authenticate(matricule, password);
    
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Matricule ou mot de passe incorrect'
      });
    }

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        matricule: employee.matricule,
        nom: employee.nom,
        prenom: employee.prenom
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour obtenir tous les employés
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    
    res.json({
      success: true,
      data: employees
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des employés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour obtenir un employé par matricule
const getEmployeeByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;
    
    const employee = await Employee.findByMatricule(matricule);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employé non trouvé'
      });
    }

    // Retourner sans le mot de passe
    const { mdp, ...employeeData } = employee;
    
    res.json({
      success: true,
      data: employeeData
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'employé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeByMatricule
};
