const Carte = require('../models/Carte');

// Contrôleur pour créer une nouvelle demande de carte
const createCarte = async (req, res) => {
  try {
    const { nomClient, prenomClient, cin, typeCarte, numCompte, emplacement, dateDemande } = req.body;

    // Validation des données
    if (!nomClient || !prenomClient || !cin || !typeCarte || !numCompte || !emplacement || !dateDemande) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Validation du nom et prénom (lettres, espaces, accents)
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
    if (!nameRegex.test(nomClient) || !nameRegex.test(prenomClient)) {
      return res.status(400).json({
        success: false,
        message: 'Le nom et le prénom doivent contenir entre 2 et 50 caractères (lettres uniquement)'
      });
    }

    // Validation du CIN (8 chiffres)
    const cinRegex = /^[0-9]{8}$/;
    if (!cinRegex.test(cin)) {
      return res.status(400).json({
        success: false,
        message: 'Le CIN doit contenir exactement 8 chiffres'
      });
    }

    // Validation du numéro de compte (10-20 chiffres)
    const compteRegex = /^[0-9]{10,20}$/;
    if (!compteRegex.test(numCompte)) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de compte doit contenir entre 10 et 20 chiffres'
      });
    }

    // Validation de l'emplacement
    const empRegex = /^[A-Za-z][0-9]{1,3}$/;
    if (!empRegex.test(emplacement)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'emplacement invalide (ex: A1, B2, C10)'
      });
    }

    // Convertir le type de carte du formulaire vers le format base de données
    const typeMapping = {
      'visa-electron-debit': 'Visa Electron Debit',
      'c-jeune': 'C\'Jeune',
      'visa-classique-nationale': 'Visa Classique Nationale',
      'mastercard': 'Mastercard',
      'virtuelle-e-pay': 'Virtuelle E‑pay',
      'technologique-cti': 'Technologique (CTI)',
      'visa-gold': 'VISA Gold',
      'mastercard-world': 'Mastercard World',
      'moussafer-platinum': 'Moussafer Platinum',
      'american-express': 'American Express',
      'lella': 'Lella',
      'el-khir': 'El Khir'
    };

    const typeCarteFormatted = typeMapping[typeCarte] || typeCarte;

    // Créer la carte
    const nouvelleCarte = await Carte.create({
      nom: nomClient.trim(),
      prenom: prenomClient.trim(),
      cin,
      type: typeCarteFormatted,
      numCompte,
      emp: emplacement.toUpperCase(),
      date: dateDemande,
      etat: 'en_cours'
    });

    res.status(201).json({
      success: true,
      message: 'Demande de carte créée avec succès',
      data: nouvelleCarte
    });

  } catch (error) {
    console.error('Erreur lors de la création de la carte:', error);
    
    if (error.message.includes('existe déjà')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('invalide') || error.message.includes('doit contenir')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour obtenir toutes les cartes
const getAllCartes = async (req, res) => {
  try {
    const cartes = await Carte.getAll();
    
    res.json({
      success: true,
      data: cartes
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour obtenir les cartes par état
const getCartesByEtat = async (req, res) => {
  try {
    const { etat } = req.params;
    const etatsValides = ['en_stock', 'en_cours', 'delivree'];
    
    if (!etatsValides.includes(etat)) {
      return res.status(400).json({
        success: false,
        message: 'État invalide. États valides: en_stock, en_cours, delivree'
      });
    }

    const cartes = await Carte.getByEtat(etat);
    
    res.json({
      success: true,
      data: cartes
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des cartes par état:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour obtenir une carte par ID
const getCarteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const carte = await Carte.findById(id);
    
    if (!carte) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée'
      });
    }

    res.json({
      success: true,
      data: carte
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la carte:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour mettre à jour l'état d'une carte
const updateCarteEtat = async (req, res) => {
  try {
    const { id } = req.params;
    const { etat } = req.body;

    if (!etat) {
      return res.status(400).json({
        success: false,
        message: 'L\'état est requis'
      });
    }

    await Carte.updateEtat(id, etat);
    
    res.json({
      success: true,
      message: 'État de la carte mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'état:', error);
    
    if (error.message === 'Carte non trouvée') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('invalide')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour mettre à jour une carte complète
const updateCarte = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, cin, typeCarte, numCompte, emplacement, etat } = req.body;

    // Validation des données
    if (!nom || !prenom || !cin || !typeCarte || !numCompte || !emplacement || !etat) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
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

    // Validation du CIN (8 chiffres)
    const cinRegex = /^[0-9]{8}$/;
    if (!cinRegex.test(cin)) {
      return res.status(400).json({
        success: false,
        message: 'Le CIN doit contenir exactement 8 chiffres'
      });
    }

    // Validation du numéro de compte (10 à 20 chiffres)
    const compteRegex = /^[0-9]{10,20}$/;
    if (!compteRegex.test(numCompte)) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de compte doit contenir entre 10 et 20 chiffres'
      });
    }

    // Validation de l'emplacement (format: lettre + chiffre)
    const empRegex = /^[A-Za-z][0-9]{1,3}$/;
    if (!empRegex.test(emplacement)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'emplacement invalide (ex: A1, B2, C10)'
      });
    }

    // Mapping des types de cartes
    const typeMapping = {
      'visa-electron-debit': 'Visa Electron Debit',
      'c-jeune': 'C\'Jeune',
      'visa-classique-nationale': 'Visa Classique Nationale',
      'mastercard': 'Mastercard',
      'virtuelle-e-pay': 'Virtuelle E‑pay',
      'technologique-cti': 'Technologique (CTI)',
      'visa-gold': 'VISA Gold',
      'mastercard-world': 'Mastercard World',
      'moussafer-platinum': 'Moussafer Platinum',
      'american-express': 'American Express',
      'lella': 'Lella',
      'el-khir': 'El Khir'
    };

    const type = typeMapping[typeCarte] || typeCarte;

    // Mapping des états
    const etatMapping = {
      'en cours': 'en_cours',
      'en stock': 'en_stock',
      'délivrée': 'delivree'
    };

    const etatBD = etatMapping[etat] || etat.replace(' ', '_');

    const updateData = {
      nom,
      prenom,
      cin,
      type,
      numCompte,
      emp: emplacement.toUpperCase(),
      etat: etatBD
    };

    await Carte.update(id, updateData);
    
    res.json({
      success: true,
      message: 'Carte mise à jour avec succès',
      data: {
        id: parseInt(id),
        ...updateData
      }
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la carte:', error);
    
    if (error.message === 'Carte non trouvée') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('invalide') || error.message.includes('doit contenir')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour obtenir les statistiques
const getStatistics = async (req, res) => {
  try {
    const stats = await Carte.getStatistics();
    
    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Contrôleur pour supprimer une carte
const deleteCarte = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'ID est un nombre valide
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de carte invalide'
      });
    }

    // Vérifier que la carte existe avant de la supprimer
    const carte = await Carte.findById(id);
    if (!carte) {
      return res.status(404).json({
        success: false,
        message: 'Carte non trouvée'
      });
    }

    // Supprimer la carte
    await Carte.delete(id);
    
    res.json({
      success: true,
      message: 'Carte supprimée avec succès',
      data: {
        id: parseInt(id),
        nom: carte.nom,
        prenom: carte.prenom,
        cin: carte.cin
      }
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la carte:', error);
    
    if (error.message === 'Carte non trouvée') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  createCarte,
  getAllCartes,
  getCartesByEtat,
  getCarteById,
  updateCarteEtat,
  updateCarte,
  getStatistics,
  deleteCarte
};
