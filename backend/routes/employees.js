const express = require('express');
const router = express.Router();
const {
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeByMatricule
} = require('../controllers/employeeController');

// Route pour l'inscription d'un nouvel employé
// POST /api/employees/register
router.post('/register', registerEmployee);

// Route pour la connexion d'un employé
// POST /api/employees/login
router.post('/login', loginEmployee);

// Route pour obtenir tous les employés
// GET /api/employees
router.get('/', getAllEmployees);

// Route pour obtenir un employé par matricule
// GET /api/employees/:matricule
router.get('/:matricule', getEmployeeByMatricule);

module.exports = router;
