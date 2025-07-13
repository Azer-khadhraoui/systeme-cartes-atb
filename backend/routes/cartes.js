const express = require('express');
const router = express.Router();
const {
  createCarte,
  getAllCartes,
  getCartesByEtat,
  getCarteById,
  updateCarteEtat,
  getStatistics
} = require('../controllers/carteController');

// Route pour créer une nouvelle demande de carte
// POST /api/cartes
router.post('/', createCarte);

// Route pour obtenir toutes les cartes
// GET /api/cartes
router.get('/', getAllCartes);

// Route pour obtenir les statistiques
// GET /api/cartes/statistics
router.get('/statistics', getStatistics);

// Route pour obtenir les cartes par état
// GET /api/cartes/etat/:etat
router.get('/etat/:etat', getCartesByEtat);

// Route pour obtenir une carte par ID
// GET /api/cartes/:id
router.get('/:id', getCarteById);

// Route pour mettre à jour l'état d'une carte
// PUT /api/cartes/:id/etat
router.put('/:id/etat', updateCarteEtat);

module.exports = router;
