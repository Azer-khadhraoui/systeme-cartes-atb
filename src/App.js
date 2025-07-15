import React, { useState, useEffect } from 'react';
import './App.css';
import atbLogo from './atb.png';
import singeImg from './singe.png';
import jsPDF from 'jspdf';

function App() {
  // État pour gérer l'utilisateur connecté
  const [user, setUser] = useState(null);
  
  // État pour basculer entre connexion et inscription
  const [isSignUp, setIsSignUp] = useState(false);
  
  // État pour gérer la navigation dans le dashboard
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'nouvelle-demande', 'stock'
  
  // État pour les données du formulaire de connexion
  const [formData, setFormData] = useState({
    matricule: '',
    password: ''
  });

  // État pour les données du formulaire d'inscription
  const [signUpData, setSignUpData] = useState({
    nom: '',
    prenom: '',
    matricule: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  // État pour la case "Se souvenir de moi"

  // Auto-login si infos présentes dans localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('atbUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedMatricule = localStorage.getItem('atbMatricule');
    const savedPassword = localStorage.getItem('atbPassword');
    if (savedMatricule && savedPassword) {
      setFormData({ matricule: savedMatricule, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  // État pour la case "Se souvenir de moi"
  const [rememberMe, setRememberMe] = useState(false);

  // États pour afficher/masquer les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // État pour le formulaire de demande de carte
  const [demandeData, setDemandeData] = useState({
    nomClient: '',
    prenomClient: '',
    cin: '',
    numCompte: '',
    typeCarte: 'visa-electron-debit',
    dateDemande: new Date().toISOString().split('T')[0], // Date actuelle automatique
    emplacement: ''
  });

  // État pour les données du stock des cartes
  const [stockData, setStockData] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(true);

  // État pour la carte sélectionnée pour visualisation
  const [selectedCarte, setSelectedCarte] = useState(null);

  // État pour la carte en cours de modification
  const [carteToEdit, setCarteToEdit] = useState(null);

  // États pour le formulaire de modification
  const [editData, setEditData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    numCompte: '',
    typeCarte: '',
    etat: '',
    dateDemande: '',
    emplacement: ''
  });

  const [editErrors, setEditErrors] = useState({});

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState('tous');
  const [filterType, setFilterType] = useState('tous');
  const [filterTime, setFilterTime] = useState('tous');

  // ========== FONCTIONS DE VALIDATION ET CONTROLE DE SAISIE ==========
  
  // Validation des noms et prénoms (lettres, espaces, accents)
  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  // Validation du CIN (exactement 8 chiffres)
  const validateCIN = (cin) => {
    const cinRegex = /^[0-9]{8}$/;
    return cinRegex.test(cin);
  };

  // Validation du numéro de compte (10 à 20 chiffres)
  const validateAccountNumber = (accountNumber) => {
    const accountRegex = /^[0-9]{10,20}$/;
    return accountRegex.test(accountNumber);
  };

  // Validation du matricule (exactement 6 chiffres)
  const validateMatricule = (matricule) => {
    const matriculeRegex = /^[0-9]{6}$/;
    return matriculeRegex.test(matricule);
  };

  // Validation de l'emplacement (format: lettre + chiffre, ex: A1, B2, C10)
  const validateEmplacement = (emplacement) => {
    const emplacementRegex = /^[A-Za-z][0-9]{1,3}$/;
    return emplacementRegex.test(emplacement.trim());
  };

  // Validation du mot de passe
  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  };

  // Fonction pour créer l'icône de mot de passe
  const createPasswordIcon = (isVisible) => {
    if (isVisible) {
      return <img src={singeImg} alt="Masquer" className="password-icon singe" />;
    } else {
      return <span className="password-icon eye">👁️</span>;
    }
  };

  // Fonction pour formater automatiquement les champs
  const formatInput = (value, type) => {
    switch (type) {
      case 'cin':
        // Supprimer tous les caractères non numériques et limiter à 8 chiffres
        return value.replace(/\D/g, '').slice(0, 8);
      case 'account':
        // Supprimer tous les caractères non numériques et limiter à 20 chiffres
        return value.replace(/\D/g, '').slice(0, 20);
      case 'name':
        // Supprimer les chiffres et caractères spéciaux, garder lettres, espaces, accents, apostrophes, tirets
        return value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '').slice(0, 50);
      case 'matricule':
        // Supprimer tous les caractères non numériques et limiter à 6 chiffres
        return value.replace(/\D/g, '').slice(0, 6);
      case 'emplacement':
        // Format lettre + chiffres, conversion en majuscules
        return value.replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
      default:
        return value;
    }
  };

  // Fonction pour gérer les changements avec validation en temps réel
  const handleInputChange = (e, formType, inputType = null) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatage automatique selon le type de champ
    if (inputType) {
      formattedValue = formatInput(value, inputType);
    }

    // Mise à jour des données selon le formulaire
    switch (formType) {
      case 'signUp':
        setSignUpData(prev => ({ ...prev, [name]: formattedValue }));
        break;
      case 'login':
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        break;
      case 'demande':
        setDemandeData(prev => ({ ...prev, [name]: formattedValue }));
        break;
      case 'edit':
        setEditData(prev => ({ ...prev, [name]: formattedValue }));
        break;
      default:
        break;
    }

    // Validation en temps réel et suppression des erreurs
    if (errors[name]) {
      const newErrors = { ...errors };
      
      // Validation spécifique par type de champ
      switch (name) {
        case 'nom':
        case 'prenom':
        case 'nomClient':
        case 'prenomClient':
          if (validateName(formattedValue)) {
            delete newErrors[name];
          }
          break;
        case 'cin':
          if (validateCIN(formattedValue)) {
            delete newErrors[name];
          }
          break;
        case 'numCompte':
          if (validateAccountNumber(formattedValue)) {
            delete newErrors[name];
          }
          break;
        case 'matricule':
          if (validateMatricule(formattedValue)) {
            delete newErrors[name];
          }
          break;
        case 'emplacement':
          if (validateEmplacement(formattedValue)) {
            delete newErrors[name];
          }
          break;
        case 'password':
          if (formattedValue.length >= 8) {
            delete newErrors[name];
          }
          break;
        case 'confirmPassword':
          const currentPassword = formType === 'signUp' ? signUpData.password : '';
          if (formattedValue === currentPassword && formattedValue.length >= 8) {
            delete newErrors[name];
          }
          break;
        default:
          if (formattedValue.trim().length > 0) {
            delete newErrors[name];
          }
          break;
      }
      
      setErrors(newErrors);
    }
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('atbUser');
    
    // Si "Se souvenir de moi" n'est pas activé, effacer aussi les identifiants
    if (!rememberMe) {
      localStorage.removeItem('atbMatricule');
      localStorage.removeItem('atbPassword');
      setFormData({ matricule: '', password: '' });
      setRememberMe(false);
    }
    // Sinon, garder les identifiants dans les champs et localStorage
  };

  // Fonctions pour les actions des boutons
  const handleVoirCarte = (carte) => {
    setSelectedCarte(carte);
    setCurrentPage('detail-carte');
  };

  const handleSupprimerCarte = async (carte) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la carte de ${carte.prenom} ${carte.nom} ?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/cartes/${carte.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.success) {
          alert(`Carte supprimée avec succès : ${carte.type} de ${carte.prenom} ${carte.nom}`);
          // Actualiser la liste des cartes
          refreshCartes();
          // Si on est sur la page de détail, retourner au stock
          if (currentPage === 'detail-carte') {
            setCurrentPage('stock');
            setSelectedCarte(null);
          }
        } else {
          alert(`Erreur lors de la suppression : ${result.message}`);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur de connexion lors de la suppression');
      }
    }
  };

  const handleModifierCarte = (carte) => {
    setCarteToEdit(carte);
    setEditData({
      nom: carte.nom || '',
      prenom: carte.prenom || '',
      cin: String(carte.cin || ''), // Convertir en chaîne
      numCompte: String(carte.numCompte || ''), // Convertir en chaîne
      typeCarte: carte.typeCarte || '',
      etat: carte.etat || '',
      dateDemande: carte.dateDemande ? new Date(carte.dateDemande).toISOString().split('T')[0] : '',
      emplacement: carte.emplacement || ''
    });
    setEditErrors({});
    setCurrentPage('modifier-carte');
  };

  const handleTelechargerPDF = () => {
    if (selectedCarte) {
      try {
        // Créer une nouvelle instance jsPDF
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Configuration des couleurs ATB
        const atbRouge = [165, 28, 48];
        const atbGris = [102, 102, 102];
        // eslint-disable-next-line no-unused-vars
        const atbBleu = [0, 51, 102];
        const atbVert = [46, 125, 50]; // Vert professionnel ATB
        const noir = [0, 0, 0];
        const blanc = [255, 255, 255];
        const grisClaire = [245, 245, 245];
        
        // ======= HEADER PROFESSIONNEL =======
        // Arrière-plan header
        doc.setFillColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.rect(0, 0, 210, 50, 'F');
        
        // Logo ATB (simulation avec texte stylisé)
        doc.setFontSize(28);
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('ATB', 20, 25);
        
        // Nom de la banque
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('ARAB TUNISIAN BANK', 20, 35);
        
        // Titre du document
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.text('FICHE DE CARTE BANCAIRE', 210 - 20, 30, { align: 'right' });
        
        // Numéro de référence
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Réf: ATB-${selectedCarte.id}-${new Date().getFullYear()}`, 210 - 20, 40, { align: 'right' });
        
        // ======= INFORMATIONS DE LA CARTE =======
        let yPos = 70;
        
        // Section avec arrière-plan
        doc.setFillColor(grisClaire[0], grisClaire[1], grisClaire[2]);
        doc.rect(15, yPos - 5, 180, 8, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(' INFORMATIONS DE LA CARTE', 20, yPos);
        
        yPos += 15;
        
        // Cadre pour les informations
        doc.setDrawColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setLineWidth(0.5);
        doc.rect(15, yPos, 180, 45);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(noir[0], noir[1], noir[2]);
        doc.setFont('helvetica', 'bold');
        
        // Première ligne
        doc.text('Type de carte:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(selectedCarte.typeCarte || ''), 65, yPos);
        
        doc.setFont('helvetica', 'bold');
        doc.text('ID Carte:', 120, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`#${String(selectedCarte.id || '')}`, 145, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('État:', 20, yPos);
        
        // Couleur selon l'état avec badge
        let etatColor, etatBg;
        if (selectedCarte.etat === 'délivrée') {
          etatColor = atbVert; // Utilisation de la couleur verte ATB
          etatBg = [232, 245, 233]; // Arrière-plan vert plus clair et moderne
        } else if (selectedCarte.etat === 'en cours') {
          etatColor = [255, 152, 0];
          etatBg = [255, 224, 178];
        } else {
          etatColor = [33, 150, 243];
          etatBg = [187, 222, 251];
        }
        
        // Badge pour l'état
        doc.setFillColor(etatBg[0], etatBg[1], etatBg[2]);
        doc.roundedRect(63, yPos - 4, 35, 7, 2, 2, 'F');
        doc.setTextColor(etatColor[0], etatColor[1], etatColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(String(selectedCarte.etat || '').toUpperCase(), 65, yPos);
        
        doc.setTextColor(noir[0], noir[1], noir[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('Emplacement:', 120, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(selectedCarte.emplacement || 'Non défini'), 160, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('Date de demande:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(new Date(selectedCarte.dateDemande).toLocaleDateString('fr-FR'), 65, yPos);
        
        // ======= INFORMATIONS DU CLIENT =======
        yPos += 25;
        
        // Section avec arrière-plan
        doc.setFillColor(grisClaire[0], grisClaire[1], grisClaire[2]);
        doc.rect(15, yPos - 5, 180, 8, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(' INFORMATIONS DU CLIENT', 20, yPos);
        
        yPos += 15;
        
        // Cadre pour les informations client
        doc.setDrawColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.rect(15, yPos, 180, 35);
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(noir[0], noir[1], noir[2]);
        doc.setFont('helvetica', 'bold');
        
        // Informations client
        doc.text('Nom complet:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(`${String(selectedCarte.prenom || '')} ${String(selectedCarte.nom || '')}`, 65, yPos);
        
        doc.setFont('helvetica', 'bold');
        doc.text('CIN:', 120, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(selectedCarte.cin || ''), 140, yPos);
        
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('N° de compte:', 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(String(selectedCarte.numCompte || ''), 65, yPos);
        
        // ======= SECTION SIGNATURE =======
        yPos += 30;
        
        // Section avec arrière-plan
        doc.setFillColor(grisClaire[0], grisClaire[1], grisClaire[2]);
        doc.rect(15, yPos - 5, 180, 8, 'F');
        
        doc.setFontSize(14);
        doc.setTextColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(' SIGNATURE ET VALIDATION', 20, yPos);
        
        yPos += 15;
        
        // Cadre signature avec design amélioré
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(1);
        doc.rect(20, yPos, 170, 45);
        
        // Ligne pointillée pour la signature
        doc.setLineDash([2, 2]);
        doc.setDrawColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.line(30, yPos + 35, 180, yPos + 35);
        doc.setLineDash([]);
        
        doc.setFontSize(10);
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFont('helvetica', 'italic');
        doc.text('Signature du client', 30, yPos + 15);
        doc.text('(Obligatoire pour validation)', 30, yPos + 25);
        
        // Date de signature
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 140, yPos + 15);
        
        yPos += 55;
        
        // Attestation
        doc.setFontSize(10);
        doc.setTextColor(noir[0], noir[1], noir[2]);
        doc.setFont('helvetica', 'normal');
        doc.text(' Le client certifie avoir reçu sa carte bancaire en bon état et fonctionnelle.', 20, yPos);
        doc.text(' Le client s\'engage à respecter les conditions d\'utilisation de la carte.', 20, yPos + 7);
        
        // Ajouter une mention de validation avec couleur verte
        doc.setFontSize(9);
        doc.setTextColor(atbVert[0], atbVert[1], atbVert[2]); // Vert professionnel ATB
        doc.text('✓ Document certifié conforme - ATB 2025', 20, yPos + 17);
        
        // ======= PIED DE PAGE PROFESSIONNEL =======
        yPos = 270;
        
        // Ligne de séparation
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(0.5);
        doc.line(20, yPos, 190, yPos);
        
        yPos += 10;
        
        // Informations du pied de page
        doc.setFontSize(8);
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFont('helvetica', 'normal');
        doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, yPos);
        doc.text('Arab Tunisian Bank - Système de gestion des cartes v2.0', 20, yPos + 5);
        
        // Contact et mentions légales
        doc.text(' (+216) 71 000 000 |  contact@atb.com.tn |  www.atb.com.tn', 20, yPos + 12);
        doc.text('© 2025 Arab Tunisian Bank - Tous droits réservés', 20, yPos + 17);
        
        // Télécharger le PDF
        const fileName = `ATB_Carte_${String(selectedCarte.typeCarte || '').replace(/[^a-zA-Z0-9]/g, '_')}_${String(selectedCarte.nom || '')}_${String(selectedCarte.prenom || '')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        alert('✅ PDF généré avec succès !\n\n📄 Document professionnel créé avec:\n• Design ATB moderne\n• Informations complètes\n• Section signature\n• Références et contacts');
        
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert(`❌ Erreur lors de la génération du PDF: ${error.message}`);
      }
    } else {
      alert('❌ Aucune carte sélectionnée pour générer le PDF.');
    }
  };

  // Fonction pour filtrer et rechercher dans les cartes
  const getFilteredCartes = () => {
    // Vérification de sécurité pour s'assurer que stockData est un tableau
    if (!Array.isArray(stockData)) {
      return [];
    }
    
    return stockData.filter(carte => {
      // Recherche textuelle (avec conversion sécurisée des types)
      const searchMatch = searchTerm === '' || 
        carte.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carte.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(carte.cin).includes(searchTerm) ||
        carte.typeCarte.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(carte.numCompte).includes(searchTerm);

      // Filtre par état
      const etatMatch = filterEtat === 'tous' || carte.etat === filterEtat;

      // Filtre par type
      const typeMatch = filterType === 'tous' || carte.typeCarte === filterType;

      // Filtre par temps (période)
      const timeMatch = () => {
        if (filterTime === 'tous') return true;
        
        const carteDate = new Date(carte.dateDemande);
        const now = new Date();
        const diffTime = Math.abs(now - carteDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filterTime) {
          case '7j':
            return diffDays <= 7;
          case '30j':
            return diffDays <= 30;
          case '90j':
            return diffDays <= 90;
          case '1an':
            return diffDays <= 365;
          default:
            return true;
        }
      };

      return searchMatch && etatMatch && typeMatch && timeMatch();
    });
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm('');
    setFilterEtat('tous');
    setFilterType('tous');
    setFilterTime('tous');
  };

  // Fonction pour gérer les changements dans le formulaire de modification
  const handleEditChange = (e) => {
    const { name } = e.target;
    
    // Utiliser la nouvelle fonction avec formatage automatique
    handleInputChange(e, 'edit', getInputType(name));
    
    // Clear error when user starts typing
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Fonction pour valider le formulaire de modification
  const validateEditForm = () => {
    const newErrors = {};
    
    // Convertir les valeurs en chaînes pour la validation
    const nom = String(editData.nom || '');
    const prenom = String(editData.prenom || '');
    const cin = String(editData.cin || '');
    const numCompte = String(editData.numCompte || '');
    const emplacement = String(editData.emplacement || '');
    
    if (!nom.trim()) {
      newErrors.nom = 'Nom requis';
    } else if (!validateName(nom)) {
      newErrors.nom = 'Nom invalide (2-50 caractères, lettres uniquement)';
    }
    
    if (!prenom.trim()) {
      newErrors.prenom = 'Prénom requis';
    } else if (!validateName(prenom)) {
      newErrors.prenom = 'Prénom invalide (2-50 caractères, lettres uniquement)';
    }
    
    if (!cin.trim()) {
      newErrors.cin = 'CIN requis';
    } else if (!validateCIN(cin)) {
      newErrors.cin = 'Le CIN doit contenir exactement 8 chiffres';
    }
    
    if (!numCompte.trim()) {
      newErrors.numCompte = 'Numéro de compte requis';
    } else if (!validateAccountNumber(numCompte)) {
      newErrors.numCompte = 'Le numéro de compte doit contenir entre 10 et 20 chiffres';
    }
    
    if (!emplacement.trim()) {
      newErrors.emplacement = 'Emplacement requis';
    } else if (!validateEmplacement(emplacement)) {
      newErrors.emplacement = 'Format d\'emplacement invalide (ex: A1, B2, C10)';
    }
    
    return newErrors;
  };

  // Fonction pour soumettre les modifications
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateEditForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Modification de la carte :', editData);
        
        // Appel à l'API backend pour modifier la carte
        const response = await fetch(`http://localhost:5000/api/cartes/${carteToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nom: editData.nom,
            prenom: editData.prenom,
            cin: editData.cin,
            typeCarte: editData.typeCarte,
            numCompte: editData.numCompte,
            emplacement: editData.emplacement,
            etat: editData.etat
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert(`✅ Carte modifiée avec succès !\n\nClient: ${editData.prenom} ${editData.nom}\nCIN: ${editData.cin}\nCompte: ${editData.numCompte}\nType: ${editData.typeCarte}\nÉtat: ${editData.etat}\nEmplacement: ${editData.emplacement}`);
          
          // Actualiser les données des cartes
          await refreshCartes();
          
          // Retour à la page de consultation du stock
          setCurrentPage('stock');
          setCarteToEdit(null);
          setEditErrors({});
        } else {
          // Afficher l'erreur retournée par l'API
          alert(`❌ Erreur lors de la modification de la carte:\n${result.message}`);
        }
      } catch (error) {
        console.error('Erreur de connexion au serveur:', error);
        alert('❌ Erreur de connexion au serveur.\nVérifiez que le backend est démarré sur le port 5000.');
      }
    } else {
      setEditErrors(newErrors);
    }
  };

  // Fonction pour gérer les changements dans tous les formulaires (ancienne version - gardée pour compatibilité)
  const handleFormChange = (e) => {
    const { name } = e.target;
    
    // Utiliser la nouvelle fonction avec formatage automatique
    if (isSignUp) {
      handleInputChange(e, 'signUp', getInputType(name));
    } else if (currentPage === 'nouvelle-demande') {
      handleInputChange(e, 'demande', getInputType(name));
    } else {
      handleInputChange(e, 'login', getInputType(name));
    }
  };

  // Fonction helper pour déterminer le type d'input
  const getInputType = (fieldName) => {
    switch (fieldName) {
      case 'nom':
      case 'prenom':
      case 'nomClient':
      case 'prenomClient':
        return 'name';
      case 'cin':
        return 'cin';
      case 'numCompte':
        return 'account';
      case 'matricule':
        return 'matricule';
      case 'emplacement':
        return 'emplacement';
      default:
        return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp) {
      // Validation pour l'inscription
      if (!signUpData.nom.trim()) {
        newErrors.nom = 'Nom requis';
      } else if (!validateName(signUpData.nom)) {
        newErrors.nom = 'Nom invalide (2-50 caractères, lettres uniquement)';
      }
      
      if (!signUpData.prenom.trim()) {
        newErrors.prenom = 'Prénom requis';
      } else if (!validateName(signUpData.prenom)) {
        newErrors.prenom = 'Prénom invalide (2-50 caractères, lettres uniquement)';
      }
      
      if (!signUpData.matricule.trim()) {
        newErrors.matricule = 'Matricule requis';
      } else if (!validateMatricule(signUpData.matricule)) {
        newErrors.matricule = 'Matricule invalide (exactement 6 chiffres requis)';
      }
      
      if (!signUpData.password) {
        newErrors.password = 'Mot de passe requis';
      } else {
        const passwordCheck = validatePassword(signUpData.password);
        if (!passwordCheck.length) {
          newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        } else if (!passwordCheck.lowercase || !passwordCheck.uppercase || !passwordCheck.numbers || !passwordCheck.special) {
          newErrors.password = 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial';
        }
      }
      
      if (!signUpData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmation du mot de passe requise';
      } else if (signUpData.password !== signUpData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    } else {
      // Validation pour la connexion
      if (!formData.matricule.trim()) {
        newErrors.matricule = 'Matricule requis';
      } else if (!validateMatricule(formData.matricule)) {
        newErrors.matricule = 'Matricule invalide (exactement 6 chiffres requis)';
      }
      
      if (!formData.password) {
        newErrors.password = 'Mot de passe requis';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
      }
    }
    
    return newErrors;
  };

  const validateDemandeForm = () => {
    const newErrors = {};
    
    if (!demandeData.nomClient.trim()) {
      newErrors.nomClient = 'Nom du client requis';
    } else if (!validateName(demandeData.nomClient)) {
      newErrors.nomClient = 'Nom invalide (2-50 caractères, lettres uniquement)';
    }
    
    if (!demandeData.prenomClient.trim()) {
      newErrors.prenomClient = 'Prénom du client requis';
    } else if (!validateName(demandeData.prenomClient)) {
      newErrors.prenomClient = 'Prénom invalide (2-50 caractères, lettres uniquement)';
    }
    
    if (!demandeData.cin.trim()) {
      newErrors.cin = 'CIN requis';
    } else if (!validateCIN(demandeData.cin)) {
      newErrors.cin = 'Le CIN doit contenir exactement 8 chiffres';
    }
    
    if (!demandeData.numCompte.trim()) {
      newErrors.numCompte = 'Numéro de compte requis';
    } else if (!validateAccountNumber(demandeData.numCompte)) {
      newErrors.numCompte = 'Le numéro de compte doit contenir entre 10 et 20 chiffres';
    }
    
    if (!demandeData.emplacement.trim()) {
      newErrors.emplacement = 'Emplacement requis';
    } else if (!validateEmplacement(demandeData.emplacement)) {
      newErrors.emplacement = 'Format d\'emplacement invalide (ex: A1, B2, C10)';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      if (isSignUp) {
        // Logique d'inscription avec appel API
        try {
          console.log('Tentative d\'inscription :', signUpData);
          
          // Préparer les données pour l'API
          const employeeData = {
            nom: signUpData.nom,
            prenom: signUpData.prenom,
            matricule: signUpData.matricule,
            password: signUpData.password
          };

          console.log('Données envoyées:', employeeData);

          // Appel à l'API backend
          const response = await fetch('http://localhost:5000/api/employees/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData)
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);

          const result = await response.json();
          console.log('Response data:', result);

          if (response.ok) {
            alert(`✅ Inscription réussie !\n\nBienvenue ${result.data.prenom} ${result.data.nom}\nMatricule: ${result.data.matricule}\n\nVous pouvez maintenant vous connecter.`);
            setIsSignUp(false); // Retour à la page de connexion
            
            // Reset form
            setSignUpData({
              nom: '',
              prenom: '',
              matricule: '',
              password: '',
              confirmPassword: ''
            });
          } else {
            // Afficher l'erreur retournée par l'API
            console.error('Erreur API:', result);
            alert(`❌ Erreur lors de l'inscription:\n${result.message || 'Erreur inconnue'}`);
          }
        } catch (error) {
          console.error('Erreur complète:', error);
          console.error('Erreur de connexion au serveur:', error.message);
          console.error('Stack trace:', error.stack);
          alert(`❌ Erreur de connexion au serveur.\nDétails: ${error.message}\nVérifiez que le backend est démarré sur le port 5000.`);
        }
      } else {
        // Logique de connexion avec appel API
        try {
          console.log('Tentative de connexion :', formData);
          
          // Appel à l'API backend pour la connexion
          const response = await fetch('http://localhost:5000/api/employees/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              matricule: formData.matricule,
              password: formData.password
            })
          });

          const result = await response.json();

          if (response.ok) {
            // Connexion réussie
            setUser({ 
              matricule: result.data.matricule,
              nom: result.data.nom,
              prenom: result.data.prenom 
            });

            // Sauvegarde dans localStorage si "Se souvenir de moi" coché
            if (rememberMe) {
              localStorage.setItem('atbUser', JSON.stringify({
                matricule: result.data.matricule,
                nom: result.data.nom,
                prenom: result.data.prenom
              }));
              localStorage.setItem('atbMatricule', formData.matricule);
              localStorage.setItem('atbPassword', formData.password);
            } else {
              localStorage.removeItem('atbUser');
              localStorage.removeItem('atbMatricule');
              localStorage.removeItem('atbPassword');
            }
            
            // Reset form seulement si "Se souvenir de moi" n'est pas activé
            if (!rememberMe) {
              setFormData({
                matricule: '',
                password: ''
              });
            }
          } else {
            // Afficher l'erreur retournée par l'API
            alert(`❌ Erreur de connexion:\n${result.message}`);
          }
        } catch (error) {
          console.error('Erreur de connexion au serveur:', error);
          alert('❌ Erreur de connexion au serveur.\nVérifiez que le backend est démarré sur le port 5000.');
        }
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Fonction pour soumettre la demande de carte
  const handleDemandeSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateDemandeForm();
    
    if (Object.keys(newErrors).length === 0) {
      try {
        console.log('Nouvelle demande de carte :', demandeData);
        
        // Appel à l'API backend pour créer la demande
        const response = await fetch('http://localhost:5000/api/cartes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nomClient: demandeData.nomClient,
            prenomClient: demandeData.prenomClient,
            cin: demandeData.cin,
            numCompte: demandeData.numCompte,
            typeCarte: demandeData.typeCarte,
            emplacement: demandeData.emplacement,
            dateDemande: demandeData.dateDemande
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert(`✅ Demande de carte créée avec succès !\n\nClient: ${demandeData.prenomClient} ${demandeData.nomClient}\nCIN: ${demandeData.cin}\nCompte: ${demandeData.numCompte}\nType: ${result.data.type}\nEmplacement: ${result.data.emp}\nDate: ${demandeData.dateDemande}\n\nLa carte est maintenant en stock.`);
          
          // Actualiser les données des cartes
          await refreshCartes();
          
          // Reset form et retour au dashboard
          setDemandeData({
            nomClient: '',
            prenomClient: '',
            cin: '',
            numCompte: '',
            typeCarte: 'visa-electron-debit',
            dateDemande: new Date().toISOString().split('T')[0],
            emplacement: ''
          });
          setCurrentPage('dashboard');
          setErrors({});
        } else {
          // Afficher l'erreur retournée par l'API
          alert(`❌ Erreur lors de la création de la demande:\n${result.message}`);
        }
      } catch (error) {
        console.error('Erreur de connexion au serveur:', error);
        alert('❌ Erreur de connexion au serveur.\nVérifiez que le backend est démarré sur le port 5000.');
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Fonction pour évaluer la force du mot de passe
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '#E0E0E0' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    const strengthLevels = [
      { score: 0, label: '', color: '#E0E0E0' },
      { score: 1, label: 'Très faible', color: '#D32F2F' },
      { score: 2, label: 'Faible', color: '#F57C00' },
      { score: 3, label: 'Moyen', color: '#FBC02D' },
      { score: 4, label: 'Fort', color: '#689F38' },
      { score: 5, label: 'Très fort', color: '#388E3C' }
    ];
    
    return strengthLevels[score];
  };

  // Charger les données des cartes au montage du composant
  useEffect(() => {
    const loadCartes = async () => {
      try {
        setIsLoadingStock(true);
        const response = await fetch('http://localhost:5000/api/cartes');
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            // Transformer les données de la base vers le format frontend
            const cartesTransformees = result.data.map(carte => {
              // Mapping des états de la base vers le frontend
              let etatFrontend;
              switch (carte.etat) {
                case 'en_stock':
                  etatFrontend = 'en stock';
                  break;
                case 'en_cours':
                  etatFrontend = 'en cours';
                  break;
                case 'delivree':
                  etatFrontend = 'délivrée';
                  break;
                default:
                  etatFrontend = carte.etat;
              }
              
              return {
                id: carte.id,
                typeCarte: carte.type,
                nom: carte.nom,
                prenom: carte.prenom,
                cin: carte.cin,
                etat: etatFrontend,
                numCompte: carte.numCompte,
                dateDemande: carte.date,
                emplacement: carte.emp
              };
            });
            setStockData(cartesTransformees);
          } else {
            console.error('Format de réponse inattendu:', result);
            setStockData([]);
          }
        } else {
          console.error('Erreur lors de la récupération des cartes');
          setStockData([]);
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        setStockData([]);
      } finally {
        setIsLoadingStock(false);
      }
    };

    loadCartes();
  }, []);

  // Fonction pour actualiser les données des cartes
  const refreshCartes = async () => {
    try {
      setIsLoadingStock(true);
      const response = await fetch('http://localhost:5000/api/cartes');
      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Transformer les données de la base vers le format frontend
          const cartesTransformees = result.data.map(carte => {
            // Mapping des états de la base vers le frontend
            let etatFrontend;
            switch (carte.etat) {
              case 'en_stock':
                etatFrontend = 'en stock';
                break;
              case 'en_cours':
                etatFrontend = 'en cours';
                break;
              case 'delivree':
                etatFrontend = 'délivrée';
                break;
              default:
                etatFrontend = carte.etat;
            }
            
            return {
              id: carte.id,
              typeCarte: carte.type,
              nom: carte.nom,
              prenom: carte.prenom,
              cin: carte.cin,
              etat: etatFrontend,
              numCompte: carte.numCompte,
              dateDemande: carte.date,
              emplacement: carte.emp
            };
          });
          setStockData(cartesTransformees);
        } else {
          console.error('Format de réponse inattendu:', result);
          setStockData([]);
        }
      } else {
        console.error('Erreur lors de la récupération des cartes');
        setStockData([]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'actualisation:', error);
      setStockData([]);
    } finally {
      setIsLoadingStock(false);
    }
  };

  // Si l'utilisateur est connecté, afficher la page appropriée
  if (user) {
    if (currentPage === 'nouvelle-demande') {
      return (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="header-content">
              <div className="logo-section">
                <img src={atbLogo} alt="ATB Logo" className="header-logo" />
                <span className="bank-name">Arab Tunisian Bank</span>
              </div>
              <div className="user-section">
                <button 
                  onClick={() => setCurrentPage('dashboard')} 
                  className="back-btn"
                >
                  ← Retour au dashboard
                </button>
                <span className="welcome-text">Bienvenue, {user.prenom} {user.nom}</span>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            <div className="form-container">
              <div className="atb-logo-form">
                <img src={atbLogo} alt="ATB Logo" className="form-logo" />
                <h2>Arab Tunisian Bank</h2>
              </div>
              <div className="form-header">
                <h1 className="form-title">Nouvelle Demande de Carte</h1>
                <p className="form-description">Remplissez les informations du client pour créer une nouvelle demande</p>
              </div>

              <form onSubmit={handleDemandeSubmit} className="demande-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nomClient">Nom du client *</label>
                    <input
                      type="text"
                      id="nomClient"
                      name="nomClient"
                      value={demandeData.nomClient}
                      onChange={(e) => handleInputChange(e, 'demande', 'name')}
                      className={errors.nomClient ? 'error' : ''}
                      placeholder="Entrez le nom du client"
                      required
                      minLength="2"
                      maxLength="50"
                      pattern="[a-zA-ZÀ-ÿ\s'-]{2,50}"
                      title="Le nom doit contenir entre 2 et 50 caractères (lettres uniquement)"
                    />
                    {errors.nomClient && <span className="error-message">{errors.nomClient}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenomClient">Prénom du client *</label>
                    <input
                      type="text"
                      id="prenomClient"
                      name="prenomClient"
                      value={demandeData.prenomClient}
                      onChange={(e) => handleInputChange(e, 'demande', 'name')}
                      className={errors.prenomClient ? 'error' : ''}
                      placeholder="Entrez le prénom du client"
                      required
                      minLength="2"
                      maxLength="50"
                      pattern="[a-zA-ZÀ-ÿ\s'-]{2,50}"
                      title="Le prénom doit contenir entre 2 et 50 caractères (lettres uniquement)"
                    />
                    {errors.prenomClient && <span className="error-message">{errors.prenomClient}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cin">CIN *</label>
                    <input
                      type="text"
                      id="cin"
                      name="cin"
                      value={demandeData.cin}
                      onChange={(e) => handleInputChange(e, 'demande', 'cin')}
                      className={errors.cin ? 'error' : ''}
                      placeholder="12345678 (8 chiffres)"
                      maxLength="8"
                      minLength="8"
                      pattern="[0-9]{8}"
                      title="Le CIN doit contenir exactement 8 chiffres"
                      inputMode="numeric"
                      required
                    />
                    {errors.cin && <span className="error-message">{errors.cin}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="numCompte">Numéro de compte *</label>
                    <input
                      type="text"
                      id="numCompte"
                      name="numCompte"
                      value={demandeData.numCompte}
                      onChange={(e) => handleInputChange(e, 'demande', 'account')}
                      className={errors.numCompte ? 'error' : ''}
                      placeholder="1234567890123 (10-20 chiffres)"
                      minLength="10"
                      maxLength="20"
                      pattern="[0-9]{10,20}"
                      title="Le numéro de compte doit contenir entre 10 et 20 chiffres"
                      inputMode="numeric"
                      required
                    />
                    {errors.numCompte && <span className="error-message">{errors.numCompte}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="typeCarte">Type de carte *</label>
                    <select
                      id="typeCarte"
                      name="typeCarte"
                      value={demandeData.typeCarte}
                      onChange={handleFormChange}
                      className="select-field"
                      required
                    >
                      <option value="visa-electron-debit">Visa Electron Debit</option>
                      <option value="c-jeune">C'Jeune</option>
                      <option value="visa-classique-nationale">Visa Classique Nationale</option>
                      <option value="mastercard">Mastercard</option>
                      <option value="virtuelle-e-pay">Virtuelle E‑pay</option>
                      <option value="technologique-cti">Technologique (CTI)</option>
                      <option value="visa-gold">VISA Gold</option>
                      <option value="mastercard-world">Mastercard World</option>
                      <option value="moussafer-platinum">Moussafer Platinum</option>
                      <option value="american-express">American Express</option>
                      <option value="lella">Lella</option>
                      <option value="el-khir">El Khir</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="emplacement">Emplacement de la carte *</label>
                    <input
                      type="text"
                      id="emplacement"
                      name="emplacement"
                      value={demandeData.emplacement}
                      onChange={(e) => handleInputChange(e, 'demande', 'emplacement')}
                      className={errors.emplacement ? 'error' : ''}
                      placeholder="Ex: A1, B2, C10 (lettre + chiffres)"
                      required
                      minLength="2"
                      maxLength="4"
                      pattern="[A-Za-z][0-9]{1,3}"
                      title="Format: une lettre suivie de 1 à 3 chiffres (ex: A1, B2, C10)"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.emplacement && <span className="error-message">{errors.emplacement}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateDemande">Date de demande</label>
                    <input
                      type="date"
                      id="dateDemande"
                      name="dateDemande"
                      value={demandeData.dateDemande}
                      className="date-field"
                      readOnly
                    />
                    <small className="form-help">Date automatiquement générée</small>
                  </div>

                  <div className="form-group">
                    {/* Champ vide pour maintenir l'alignement */}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage('dashboard')}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    Soumettre la demande
                  </button>
                </div>
              </form>
            </div>
          </main>

          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-left">
                <img src={atbLogo} alt="ATB Logo" className="footer-logo" />
                <span>&copy; {new Date().getFullYear()} Arab Tunisian Bank. Tous droits réservés.</span>
              </div>
              <div className="footer-right">
                <span>Système de gestion des cartes v2.0</span>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    // Page de consultation du stock
    if (currentPage === 'stock') {
      // Protection contre les erreurs si stockData n'est pas un tableau
      const safeStockData = Array.isArray(stockData) ? stockData : [];
      const totalCartes = safeStockData.length;
      const cartesDelivrees = safeStockData.filter(carte => carte.etat === 'délivrée').length;
      const cartesEnStock = safeStockData.filter(carte => carte.etat === 'en stock').length;
      const cartesEnCours = safeStockData.filter(carte => carte.etat === 'en cours').length;

      return (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="header-content">
              <div className="logo-section">
                <img src={atbLogo} alt="ATB Logo" className="header-logo" />
                <span className="bank-name">Arab Tunisian Bank</span>
              </div>
              <div className="user-section">
                <button 
                  onClick={() => setCurrentPage('dashboard')} 
                  className="back-btn"
                >
                  ← Retour au dashboard
                </button>
                <span className="welcome-text">Bienvenue, {user.prenom} {user.nom}</span>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            <div className="page-header">
              <h1>Consultation des Cartes</h1>
              <p>État des cartes bancaires et des clients</p>
            </div>

            <div className="stock-summary">
              <div className="summary-card total">
                <div className="summary-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <h3>Total Cartes</h3>
                  <div className="summary-value">{totalCartes}</div>
                  <div className="summary-label">cartes gérées</div>
                </div>
              </div>

              <div className="summary-card ok">
                <div className="summary-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <h3>Délivrées</h3>
                  <div className="summary-value">{cartesDelivrees}</div>
                  <div className="summary-label">cartes délivrées</div>
                </div>
              </div>

              <div className="summary-card attention">
                <div className="summary-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <h3>En Cours</h3>
                  <div className="summary-value">{cartesEnCours}</div>
                  <div className="summary-label">cartes en cours</div>
                </div>
              </div>

              <div className="summary-card critique">
                <div className="summary-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <div className="summary-content">
                  <h3>En Stock</h3>
                  <div className="summary-value">{cartesEnStock}</div>
                  <div className="summary-label">cartes en stock</div>
                </div>
              </div>
            </div>

            {/* Section de recherche et filtres */}
            <div className="search-filter-section">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom, CIN, type de carte ou numéro de compte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
              </div>

              <div className="filters-container">
                <div className="filter-group">
                  <label htmlFor="filter-etat">État :</label>
                  <select
                    id="filter-etat"
                    value={filterEtat}
                    onChange={(e) => setFilterEtat(e.target.value)}
                    className="filter-select"
                  >
                    <option value="tous">Tous les états</option>
                    <option value="délivrée">Délivrée</option>
                    <option value="en stock">En stock</option>
                    <option value="en cours">En cours</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-type">Type de carte :</label>
                  <select
                    id="filter-type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="Visa Electron Debit">Visa Electron Debit</option>
                    <option value="C'Jeune">C'Jeune</option>
                    <option value="Visa Classique Nationale">Visa Classique Nationale</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Virtuelle E‑pay">Virtuelle E‑pay</option>
                    <option value="Technologique (CTI)">Technologique (CTI)</option>
                    <option value="VISA Gold">VISA Gold</option>
                    <option value="Mastercard World">Mastercard World</option>
                    <option value="Moussafer Platinum">Moussafer Platinum</option>
                    <option value="American Express">American Express</option>
                    <option value="Lella">Lella</option>
                    <option value="El Khir">El Khir</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="filter-time">Période :</label>
                  <select
                    id="filter-time"
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value)}
                    className="filter-select"
                  >
                    <option value="tous">Toutes les périodes</option>
                    <option value="7j">7 derniers jours</option>
                    <option value="30j">30 derniers jours</option>
                    <option value="90j">90 derniers jours</option>
                    <option value="1an">1 an</option>
                  </select>
                </div>

                <button 
                  onClick={resetFilters}
                  className="reset-filters-btn"
                  title="Réinitialiser les filtres"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                  Réinitialiser
                </button>
              </div>
            </div>

            <div className="stock-table-container">
              <div className="results-info">
                <span>{getFilteredCartes().length} cartes trouvées</span>
                <button 
                  onClick={refreshCartes}
                  className="refresh-btn"
                  disabled={isLoadingStock}
                  title="Actualiser les données"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                  {isLoadingStock ? 'Actualisation...' : 'Actualiser'}
                </button>
              </div>
              
              {isLoadingStock ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Chargement des données des cartes...</p>
                </div>
              ) : (
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Type de carte</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>État</th>
                    <th>Date demande</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredCartes().map((carte) => {
                    return (
                      <tr key={carte.id} className={`row-${carte.etat.replace(' ', '-')}`}>
                        <td className="carte-nom">{carte.typeCarte}</td>
                        <td className="user-nom">{carte.nom}</td>
                        <td className="user-prenom">{carte.prenom}</td>
                        <td>
                          <span className={`status-badge ${carte.etat.replace(' ', '-')}`}>
                            {carte.etat.charAt(0).toUpperCase() + carte.etat.slice(1)}
                          </span>
                        </td>
                        <td className="date-demande">{new Date(carte.dateDemande).toLocaleDateString('fr-FR')}</td>
                        <td className="actions-cell">
                          <button 
                            onClick={() => handleVoirCarte(carte)} 
                            className="action-btn voir-btn"
                            title="Voir les détails"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleModifierCarte(carte)} 
                            className="action-btn modifier-btn"
                            title="Modifier les informations"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                              <path d="M15 5l4 4"/>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleSupprimerCarte(carte)} 
                            className="action-btn supprimer-btn"
                            title="Supprimer la carte"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              )}
              
              {!isLoadingStock && getFilteredCartes().length === 0 && (
                <div className="no-results">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  <p>Aucune carte trouvée avec les critères de recherche.</p>
                  <button onClick={resetFilters} className="reset-search-btn">
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </main>

          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-left">
                <img src={atbLogo} alt="ATB Logo" className="footer-logo" />
                <span>Arab Tunisian Bank</span>
              </div>
              <div className="footer-right">
                <span>Système de gestion des cartes v2.0</span>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    // Page de détail d'une carte
    if (currentPage === 'detail-carte' && selectedCarte) {
      return (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="header-content">
              <div className="logo-section">
                <img src={atbLogo} alt="ATB Logo" className="header-logo" />
                <span className="bank-name">Arab Tunisian Bank</span>
              </div>
              <div className="user-section">
                <button 
                  onClick={() => setCurrentPage('stock')} 
                  className="back-btn"
                >
                  ← Retour au stock
                </button>
                <span className="welcome-text">Bienvenue, {user.prenom} {user.nom}</span>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            <div className="page-header">
              <h1 className="page-title">Détails de la carte bancaire</h1>
            </div>

            <div className="carte-detail-container">
              <div className="carte-detail-card">
                <div className="carte-header">
                  <div className="carte-type">
                    <h2>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '40px', height: '40px', marginRight: '15px', verticalAlign: 'middle'}}>
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      {selectedCarte.typeCarte}
                    </h2>
                    <span className={`status-badge ${selectedCarte.etat.replace(' ', '-')}`}>
                      {selectedCarte.etat.charAt(0).toUpperCase() + selectedCarte.etat.slice(1)}
                    </span>
                  </div>
                  <div className="carte-id">
                    <span className="id-label">ID: </span>
                    <span className="id-value">#{selectedCarte.id}</span>
                  </div>
                </div>

                <div className="carte-info-grid">
                  <div className="info-section">
                    <h3>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '20px', height: '20px'}}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Informations personnelles
                    </h3>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Nom :
                      </span>
                      <span className="info-value">{selectedCarte.nom}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        Prénom :
                      </span>
                      <span className="info-value">{selectedCarte.prenom}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                        CIN :
                      </span>
                      <span className="info-value">{selectedCarte.cin}</span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '20px', height: '20px'}}>
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                      Informations bancaires
                    </h3>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        Numéro de compte :
                      </span>
                      <span className="info-value">{selectedCarte.numCompte}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                          <line x1="1" y1="10" x2="23" y2="10"/>
                        </svg>
                        Type de carte :
                      </span>
                      <span className="info-value">{selectedCarte.typeCarte}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        Date de demande :
                      </span>
                      <span className="info-value">{new Date(selectedCarte.dateDemande).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: '16px', height: '16px', marginRight: '8px'}}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Emplacement :
                      </span>
                      <span className="info-value">{selectedCarte.emplacement || 'Non défini'}</span>
                    </div>
                  </div>
                </div>

                <div className="carte-actions">
                  <button 
                    onClick={handleTelechargerPDF} 
                    className="btn btn-primary pdf-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <path d="M14 2v6h6"/>
                      <path d="M16 13H8"/>
                      <path d="M16 17H8"/>
                      <path d="M10 9H8"/>
                    </svg>
                    Télécharger PDF pour signature
                  </button>
                  <button 
                    onClick={() => handleModifierCarte(selectedCarte)} 
                    className="btn btn-secondary"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      <path d="M15 5l4 4"/>
                    </svg>
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleSupprimerCarte(selectedCarte)} 
                    className="btn btn-danger"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </main>

          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-left">
                <img src={atbLogo} alt="ATB Logo" className="footer-logo" />
                <span>Arab Tunisian Bank</span>
              </div>
              <div className="footer-right">
                <span>Système de gestion des cartes v2.0</span>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    // Page de modification d'une carte
    if (currentPage === 'modifier-carte' && carteToEdit) {
      return (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="header-content">
              <div className="logo-section">
                <img src={atbLogo} alt="ATB Logo" className="header-logo" />
                <span className="bank-name">Arab Tunisian Bank</span>
              </div>
              <div className="user-section">
                <button 
                  onClick={() => setCurrentPage('stock')} 
                  className="back-btn"
                >
                  ← Retour au stock
                </button>
                <span className="welcome-text">Bienvenue, {user.prenom} {user.nom}</span>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            <div className="page-header">
              <h1 className="page-title">Modifier la carte bancaire</h1>
                           <p>Modifiez les informations de la carte de {carteToEdit.prenom} {carteToEdit.nom}</p>
            </div>

            <div className="form-container">
              <div className="atb-logo-form">
                <img src={atbLogo} alt="ATB Logo" className="form-logo" />
                <h2>Arab Tunisian Bank</h2>
              </div>
              <div className="form-header">
                <h1 className="form-title">Modification de Carte</h1>
                <p className="form-description">Modifiez les informations nécessaires</p>
              </div>

              <form onSubmit={handleEditSubmit} className="demande-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom du client *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={editData.nom}
                      onChange={(e) => handleInputChange(e, 'edit', 'name')}
                      className={editErrors.nom ? 'error' : ''}
                      placeholder="Entrez le nom du client"
                      required
                      minLength="2"
                      maxLength="50"
                      pattern="[a-zA-ZÀ-ÿ\s'-]{2,50}"
                      title="Le nom doit contenir entre 2 et 50 caractères (lettres uniquement)"
                    />
                    {editErrors.nom && <span className="error-message">{editErrors.nom}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenom">Prénom du client *</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={editData.prenom}
                      onChange={(e) => handleInputChange(e, 'edit', 'name')}
                      className={editErrors.prenom ? 'error' : ''}
                      placeholder="Entrez le prénom du client"
                      required
                      minLength="2"
                      maxLength="50"
                      pattern="[a-zA-ZÀ-ÿ\s'-]{2,50}"
                      title="Le prénom doit contenir entre 2 et 50 caractères (lettres uniquement)"
                    />
                    {editErrors.prenom && <span className="error-message">{editErrors.prenom}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cin">CIN *</label>
                    <input
                      type="text"
                      id="cin"
                      name="cin"
                      value={editData.cin}
                      onChange={(e) => handleInputChange(e, 'edit', 'cin')}
                      className={editErrors.cin ? 'error' : ''}
                      placeholder="12345678 (8 chiffres)"
                      maxLength="8"
                      minLength="8"
                      pattern="[0-9]{8}"
                      title="Le CIN doit contenir exactement 8 chiffres"
                      inputMode="numeric"
                      required
                    />
                    {editErrors.cin && <span className="error-message">{editErrors.cin}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="numCompte">Numéro de compte *</label>
                    <input
                      type="text"
                      id="numCompte"
                      name="numCompte"
                      value={editData.numCompte}
                      onChange={(e) => handleInputChange(e, 'edit', 'account')}
                      className={editErrors.numCompte ? 'error' : ''}
                      placeholder="1234567890123 (10-20 chiffres)"
                      minLength="10"
                      maxLength="20"
                      pattern="[0-9]{10,20}"
                      title="Le numéro de compte doit contenir entre 10 et 20 chiffres"
                      inputMode="numeric"
                      required
                    />
                    {editErrors.numCompte && <span className="error-message">{editErrors.numCompte}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="typeCarte">Type de carte *</label>
                    <select
                      id="typeCarte"
                      name="typeCarte"
                      value={editData.typeCarte}
                      onChange={handleEditChange}
                      className="select-field"
                      required
                    >
                      <option value="Visa Electron Debit">Visa Electron Debit</option>
                      <option value="C'Jeune">C'Jeune</option>
                      <option value="Visa Classique Nationale">Visa Classique Nationale</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Virtuelle E‑pay">Virtuelle E‑pay</option>
                      <option value="Technologique (CTI)">Technologique (CTI)</option>
                      <option value="VISA Gold">VISA Gold</option>
                      <option value="Mastercard World">Mastercard World</option>
                      <option value="Moussafer Platinum">Moussafer Platinum</option>
                      <option value="American Express">American Express</option>
                      <option value="Lella">Lella</option>
                      <option value="El Khir">El Khir</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="etat">État de la carte *</label>
                    <select
                      id="etat"
                      name="etat"
                      value={editData.etat}
                      onChange={handleEditChange}
                      className="select-field"
                      required
                    >
                      <option value="en cours">En cours</option>
                      <option value="en stock">En stock</option>
                      <option value="délivrée">Délivrée</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group emplacement-field">
                    <label htmlFor="emplacement">Emplacement de la carte *</label>
                    <input
                      type="text"
                      id="emplacement"
                      name="emplacement"
                      value={editData.emplacement}
                      onChange={(e) => handleInputChange(e, 'edit', 'emplacement')}
                      className={`emplacement-input ${editErrors.emplacement ? 'error' : ''}`}
                      placeholder="Ex: A1, B2, C10 (lettre + chiffres)"
                      required
                      minLength="2"
                      maxLength="4"
                      pattern="[A-Za-z][0-9]{1,3}"
                      title="Format: une lettre suivie de 1 à 3 chiffres (ex: A1, B2, C10)"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {editErrors.emplacement && <span className="error-message">{editErrors.emplacement}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateDemande">Date de demande</label>
                    <input
                      type="date"
                      id="dateDemande"
                      name="dateDemande"
                      value={editData.dateDemande}
                      className="date-field"
                      readOnly
                    />
                    <small className="form-help">Date de demande originale (non modifiable)</small>
                  </div>

                  <div className="form-group">
                    {/* Champ vide pour maintenir l'alignement */}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage('stock')}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    Sauvegarder les modifications
                  </button>
                </div>
              </form>
            </div>
          </main>

          <footer className="dashboard-footer">
            <div className="footer-content">
              <div className="footer-left">
                <img src={atbLogo} alt="ATB Logo" className="footer-logo" />
                <span>Arab Tunisian Bank</span>
              </div>
              <div className="footer-right">
                <span>Système de gestion des cartes v2.0</span>
              </div>
            </div>
          </footer>
        </div>
      );
    }

    // Dashboard principal
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="logo-section">
              <img src={atbLogo} alt="ATB Logo" className="header-logo" />
              <span className="bank-name">Arab Tunisian Bank</span>
            </div>
            <div className="user-section">
              <span className="welcome-text">Bienvenue, {user.prenom} {user.nom}</span>
              <button 
                onClick={handleLogout} 
                className="logout-btn"
              >
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Espace Gestion des Cartes
                <span className="hero-subtitle">ATB</span>
              </h1>
              <p className="hero-description">
                Gérez facilement vos demandes de cartes bancaires et consultez le stock disponible
              </p>
            </div>
            <div className="hero-graphic">
              <div className="floating-card card-1"></div>
              <div className="floating-card card-2"></div>
              <div className="floating-card card-3"></div>
            </div>
          </div>

          <div className="actions-container">
            <div className="action-card add-card">
              <div className="card-icon">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="card-content">
                <h3>Nouvelle Demande</h3>
                <p>Ajoutez une nouvelle demande de carte bancaire</p>
                <div className="card-features">
                  <span>• saisie de la demande</span>
                  <span>• Attribution d’un emplacement physique de la carte</span>
                  <span>• Processus rapide et sécurisé</span>
                </div>
              </div>
              <button className="action-button add-button" onClick={() => setCurrentPage('nouvelle-demande')}>
                <span>Ajouter une demande</span>
                <div className="button-arrow">→</div>
              </button>
              <div className="card-glow add-glow"></div>
            </div>

            <div className="action-card stock-card">
              <div className="card-icon">
                <div className="icon-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" strokeWidth="2"/>
                    <path d="M9 11V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" strokeWidth="2"/>
                    <path d="M9 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div className="card-content">
                <h3>Cartes en Stock</h3>
                <p>Consultez le stock disponible et les statistiques</p>
                <div className="card-features">
                  <span>• Vue d'ensemble</span>
                  <span>• Statistiques détaillées</span>
                  <span>• status des cartes</span>
                </div>
              </div>
              <button className="action-button stock-button" onClick={() => setCurrentPage('stock')}>
                <span>Consulter le stock</span>
                <div className="button-arrow">→</div>
              </button>
              <div className="card-glow stock-glow"></div>
            </div>
          </div>
        </main>

        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-left">
              <img src={atbLogo} alt="ATB Logo" className="footer-logo" />
              <span>&copy; {new Date().getFullYear()} Arab Tunisian Bank. Tous droits réservés.</span>
            </div>
            <div className="footer-right">
              <span>Système de gestion des cartes v2.0</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Sinon, afficher le formulaire de connexion
  return (
    <div className="App" data-page={isSignUp ? 'signup' : 'login'}>
      <div className={`login-container ${isSignUp ? 'signup-container' : ''}`}>
        <div className={`login-card ${isSignUp ? 'signup-mode' : 'login-mode'}`}>
          <div className="login-header">
            <div className="atb-logo">
              <img src={atbLogo} alt="ATB Logo" className="atb-logo-image" />
              <h1>ATB</h1>
              <span>Arab Tunisian Bank</span>
            </div>
            <h2>{isSignUp ? 'Inscription ATB' : 'Espace Cartes ATB'}</h2>
            <p>{isSignUp ? 'Créez votre compte pour accéder à votre espace' : 'Connectez-vous à votre espace de gestion'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp ? (
              // Formulaire d'inscription avec disposition en largeur
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={signUpData.nom}
                      onChange={(e) => handleInputChange(e, 'signUp', 'name')}
                      className={errors.nom ? 'error' : ''}
                      placeholder="Entrez votre nom"
                      required
                      minLength="2"
                      maxLength="50"
                      pattern="[a-zA-ZÀ-ÿ\s'-]{2,50}"
                      title="Le nom doit contenir entre 2 et 50 caractères (lettres uniquement)"
                    />
                    {errors.nom && <span className="error-message">{errors.nom}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenom">Prénom *</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={signUpData.prenom}
                      onChange={(e) => handleInputChange(e, 'signUp', 'name')}
                      className={errors.prenom ? 'error' : ''}
                      placeholder="Entrez votre prénom"
                      required
                      minLength="2"
                      maxLength="50"
                      pattern="[a-zA-ZÀ-ÿ\s'-]{2,50}"
                      title="Le prénom doit contenir entre 2 et 50 caractères (lettres uniquement)"
                    />
                    {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="matricule">Matricule *</label>
                    <input
                      type="text"
                      id="matricule"
                      name="matricule"
                      value={signUpData.matricule}
                      onChange={(e) => handleInputChange(e, 'signUp', 'matricule')}
                      className={errors.matricule ? 'error' : ''}
                      placeholder="123456 (6 chiffres)"
                      required
                      minLength="6"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      title="Le matricule doit contenir exactement 6 chiffres"
                      inputMode="numeric"
                    />
                    {errors.matricule && <span className="error-message">{errors.matricule}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Mot de passe *</label>
                    <div className="password-input-container">
                      <input
                        type={showSignUpPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={signUpData.password}
                        onChange={(e) => handleInputChange(e, 'signUp', 'password')}
                        className={errors.password ? 'error' : ''}
                        placeholder="Entrez votre mot de passe"
                        required
                        minLength="8"
                        title="Le mot de passe doit contenir au moins 8 caractères avec majuscules, minuscules et chiffres"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        title={showSignUpPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {createPasswordIcon(showSignUpPassword)}
                      </button>
                    </div>
                    <div className="password-help">
                      Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={signUpData.confirmPassword}
                        onChange={(e) => handleInputChange(e, 'signUp', 'confirmPassword')}
                        className={errors.confirmPassword ? 'error' : ''}
                        placeholder="Confirmez votre mot de passe"
                        required
                        minLength="8"
                        title="Doit être identique au mot de passe"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                      >
                        {createPasswordIcon(showConfirmPassword)}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </div>
                </div>

                {signUpData.password && (
                  <div className="password-strength-full">
                    <label>Force du mot de passe</label>
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${(getPasswordStrength(signUpData.password).score / 5) * 100}%`,
                          backgroundColor: getPasswordStrength(signUpData.password).color
                        }}
                      ></div>
                    </div>
                    <span 
                      className="strength-label"
                      style={{ color: getPasswordStrength(signUpData.password).color }}
                    >
                      {getPasswordStrength(signUpData.password).label}
                    </span>
                  </div>
                )}
              </>
            ) : (
              // Formulaire de connexion
              <>
                <div className="form-group">
                  <label htmlFor="matricule">Matricule</label>
                  <input
                    type="text"
                    id="matricule"
                    name="matricule"
                    value={formData.matricule}
                    onChange={(e) => handleInputChange(e, 'login', 'matricule')}
                    className={errors.matricule ? 'error' : ''}
                    placeholder="123456 (6 chiffres)"
                    required
                    minLength="6"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    title="Le matricule doit contenir exactement 6 chiffres"
                    inputMode="numeric"
                  />
                  {errors.matricule && <span className="error-message">{errors.matricule}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange(e, 'login', 'password')}
                      className={errors.password ? 'error' : ''}
                      placeholder="Entrez votre mot de passe"
                      required
                      minLength="8"
                      title="Le mot de passe doit contenir au moins 8 caractères"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {createPasswordIcon(showPassword)}
                    </button>
                  </div>
                  <div className="password-help">
                    Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
                  </div>
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="signup-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Pas de compte ? S'inscrire
                </button>
              </div>
            )}

            <button type="submit" className="login-button">
              {isSignUp ? 'S\'inscrire' : 'Se connecter'}
            </button>

            {isSignUp && (
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="signup-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            )}
          </form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} Arab Tunisian Bank. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
