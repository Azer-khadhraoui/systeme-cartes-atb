import React, { useState } from 'react';
import './App.css';
import atbLogo from './atb.png';
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

  // État pour le formulaire de demande de carte
  const [demandeData, setDemandeData] = useState({
    nomClient: '',
    prenomClient: '',
    cin: '',
    numCompte: '',
    typeCarte: 'visa-electron-debit',
    dateDemande: new Date().toISOString().split('T')[0] // Date actuelle automatique
  });

  // État pour les données du stock des cartes
  const [stockData] = useState([
    { id: 1, typeCarte: 'Visa Electron Debit', nom: 'Ben Ahmed', prenom: 'Mohamed', cin: '12345678', etat: 'délivré', numCompte: '0123456789012', dateDemande: '2024-12-15' },
    { id: 2, typeCarte: 'C\'Jeune', nom: 'Trabelsi', prenom: 'Fatma', cin: '23456789', etat: 'en stock', numCompte: '1234567890123', dateDemande: '2024-12-10' },
    { id: 3, typeCarte: 'Visa Classique Nationale', nom: 'Hamdi', prenom: 'Karim', cin: '34567890', etat: 'en cours', numCompte: '2345678901234', dateDemande: '2024-12-20' },
    { id: 4, typeCarte: 'Mastercard', nom: 'Sassi', prenom: 'Amina', cin: '45678901', etat: 'délivré', numCompte: '3456789012345', dateDemande: '2024-12-05' },
    { id: 5, typeCarte: 'Virtuelle E‑pay', nom: 'Mzoughi', prenom: 'Rami', cin: '56789012', etat: 'en stock', numCompte: '4567890123456', dateDemande: '2024-12-18' },
    { id: 6, typeCarte: 'Technologique (CTI)', nom: 'Ferchichi', prenom: 'Lilia', cin: '67890123', etat: 'en cours', numCompte: '5678901234567', dateDemande: '2024-12-12' },
    { id: 7, typeCarte: 'VISA Gold', nom: 'Gharbi', prenom: 'Sami', cin: '78901234', etat: 'délivré', numCompte: '6789012345678', dateDemande: '2024-12-08' },
    { id: 8, typeCarte: 'Mastercard World', nom: 'Bouaziz', prenom: 'Nour', cin: '89012345', etat: 'en stock', numCompte: '7890123456789', dateDemande: '2024-12-22' },
    { id: 9, typeCarte: 'Moussafer Platinum', nom: 'Chedly', prenom: 'Youssef', cin: '90123456', etat: 'en cours', numCompte: '8901234567890', dateDemande: '2024-12-03' },
    { id: 10, typeCarte: 'American Express', nom: 'Jebali', prenom: 'Salma', cin: '01234567', etat: 'délivré', numCompte: '9012345678901', dateDemande: '2024-12-14' },
    { id: 11, typeCarte: 'Lella', nom: 'Mzali', prenom: 'Ines', cin: '11223344', etat: 'en stock', numCompte: '0123456789013', dateDemande: '2024-12-25' },
    { id: 12, typeCarte: 'El Khir', nom: 'Khemiri', prenom: 'Omar', cin: '22334455', etat: 'en cours', numCompte: '1234567890124', dateDemande: '2024-12-17' }
  ]);

  // État pour la carte sélectionnée pour visualisation
  const [selectedCarte, setSelectedCarte] = useState(null);

  // Fonctions pour les actions des boutons
  const handleVoirCarte = (carte) => {
    setSelectedCarte(carte);
    setCurrentPage('detail-carte');
  };

  const handleSupprimerCarte = (carte) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la carte de ${carte.prenom} ${carte.nom} ?`)) {
      alert(`Carte supprimée : ${carte.typeCarte} de ${carte.prenom} ${carte.nom}`);
      // Ici vous pouvez ajouter la logique de suppression réelle
    }
  };

  const handleModifierCarte = (carte) => {
    alert(`Modification de la carte : ${carte.typeCarte} de ${carte.prenom} ${carte.nom}`);
    // Ici vous pouvez ajouter la logique de modification réelle
  };

  const handleTelechargerPDF = () => {
    if (selectedCarte) {
      try {
        // Créer un nouveau document PDF
        const doc = new jsPDF();
        
        // Configuration des couleurs ATB
        const atbRouge = [165, 28, 48];
        const atbRougeClair = [232, 212, 215];
        const atbGris = [102, 102, 102];
        const noir = [0, 0, 0];
        const blanc = [255, 255, 255];
        const vertSucces = [40, 167, 69];
        const bleuInfo = [0, 123, 255];
        const orangeAttention = [255, 193, 7];
        
        // En-tête élégant avec dégradé simulé
        doc.setFillColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.rect(0, 0, 210, 35, 'F');
        
        // Bande décorative
        doc.setFillColor(atbRougeClair[0], atbRougeClair[1], atbRougeClair[2]);
        doc.rect(0, 35, 210, 5, 'F');
        
        // Logo stylisé ATB
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('ATB', 20, 22);
        
        // Nom complet de la banque
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('ARAB TUNISIAN BANK', 50, 22);
        
        // Sous-titre élégant
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.text('Excellence bancaire - Innovation digitale', 20, 30);
        
        // Titre principal avec style
        doc.setTextColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('FICHE DE DEMANDE DE CARTE BANCAIRE', 20, 55);
        
        // Ligne de séparation décorative
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(2);
        doc.line(20, 60, 190, 60);
        
        // Petite ligne décorative
        doc.setDrawColor(atbRougeClair[0], atbRougeClair[1], atbRougeClair[2]);
        doc.setLineWidth(1);
        doc.line(20, 63, 100, 63);
        
        // Informations de la carte avec style
        let yPosition = 75;
        
        // Date et heure de génération stylisée
        const maintenant = new Date();
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Document généré le: ${maintenant.toLocaleDateString('fr-FR')} à ${maintenant.toLocaleTimeString('fr-FR')}`, 20, yPosition);
        yPosition += 20;
        
        // Section Informations personnelles avec style moderne
        doc.setFillColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.rect(20, yPosition, 170, 8, 'F');
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(' INFORMATIONS PERSONNELLES', 25, yPosition + 6);
        yPosition += 15;
        
        // Cadre élégant pour les informations personnelles
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(1);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(20, yPosition, 170, 35, 3, 3, 'FD');
        yPosition += 10;
        
        doc.setTextColor(noir[0], noir[1], noir[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        // Informations avec icônes et style
        doc.setFont('helvetica', 'bold');
        doc.text('Nom complet:', 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${selectedCarte.prenom} ${selectedCarte.nom}`, 70, yPosition);
        yPosition += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('CIN:', 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${selectedCarte.cin}`, 70, yPosition);
        yPosition += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Statut:', 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text('Client ATB', 70, yPosition);
        yPosition += 20;
        
        // Section Informations bancaires avec style moderne
        doc.setFillColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.rect(20, yPosition, 170, 8, 'F');
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(' INFORMATIONS BANCAIRES', 25, yPosition + 6);
        yPosition += 15;
        
        // Cadre élégant pour les informations bancaires
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(1);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(20, yPosition, 170, 35, 3, 3, 'FD');
        yPosition += 10;
        
        doc.setTextColor(noir[0], noir[1], noir[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        doc.setFont('helvetica', 'bold');
        doc.text('Numéro de compte:', 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${selectedCarte.numCompte}`, 80, yPosition);
        yPosition += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Type de carte:', 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${selectedCarte.typeCarte}`, 80, yPosition);
        yPosition += 8;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Date de demande:', 25, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(`${new Date(selectedCarte.dateDemande).toLocaleDateString('fr-FR')}`, 80, yPosition);
        yPosition += 20;
        
        // Section État avec badge coloré
        doc.setFillColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.rect(20, yPosition, 170, 8, 'F');
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(' ÉTAT DE LA DEMANDE', 25, yPosition + 6);
        yPosition += 15;
        
        // Badge d'état coloré
        let couleurEtat, texteEtat;
        if (selectedCarte.etat === 'délivré') {
          couleurEtat = vertSucces;
          texteEtat = ' DÉLIVRÉ';
        } else if (selectedCarte.etat === 'en cours') {
          couleurEtat = bleuInfo;
          texteEtat = ' EN COURS';
        } else {
          couleurEtat = orangeAttention;
          texteEtat = ' EN STOCK';
        }
        
        doc.setFillColor(couleurEtat[0], couleurEtat[1], couleurEtat[2]);
        doc.roundedRect(20, yPosition, 80, 12, 3, 3, 'F');
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(texteEtat, 25, yPosition + 8);
        yPosition += 20;
        
        // Section signature élégante
        doc.setFillColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.rect(20, yPosition, 170, 8, 'F');
        doc.setTextColor(blanc[0], blanc[1], blanc[2]);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(' SIGNATURE DU CLIENT', 25, yPosition + 6);
        yPosition += 15;
        
        // Cadre pour la signature avec dimensions optimisées
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(2);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, yPosition, 170, 35, 3, 3, 'FD');
        
        // Zone signature à gauche
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Signature du client:', 25, yPosition + 10);
        
        // Rectangle de signature bien visible
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(1.5);
        doc.rect(25, yPosition + 12, 70, 20);
        
        // Zone date à droite
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Date de signature:', 110, yPosition + 10);
        
        // Rectangle pour la date
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(1.5);
        doc.rect(110, yPosition + 12, 50, 20);
        
        // Date du jour pré-remplie
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(maintenant.toLocaleDateString('fr-FR'), 112, yPosition + 24);
        yPosition += 40;
        
        
        // Note légale compacte
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.text('En signant, le client confirme avoir pris connaissance des conditions générales.', 25, yPosition + 5);
        yPosition += 15;
        
        // Section validation interne compacte
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPosition, 170, 20, 'F');
        
        doc.setTextColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('VALIDATION INTERNE', 25, yPosition + 8);
        
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Visa:', 25, yPosition + 16);
        doc.text('Date:', 100, yPosition + 16);
        
        // Lignes pour la validation
        doc.setDrawColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.setLineWidth(0.5);
        doc.line(45, yPosition + 17, 85, yPosition + 17);
        doc.line(120, yPosition + 17, 180, yPosition + 17);
        
        yPosition += 30;
        
        // Pied de page élégant
        doc.setDrawColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setLineWidth(2);
        doc.line(20, yPosition, 190, yPosition);
        
        // Bande de pied de page
        doc.setFillColor(atbRougeClair[0], atbRougeClair[1], atbRougeClair[2]);
        doc.rect(0, yPosition + 5, 210, 20, 'F');
        
        doc.setTextColor(atbRouge[0], atbRouge[1], atbRouge[2]);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Arab Tunisian Bank', 20, yPosition + 15);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Système de gestion des cartes bancaires', 20, yPosition + 20);
        
        // Informations de génération à droite
        doc.setTextColor(atbGris[0], atbGris[1], atbGris[2]);
        doc.text(`Document généré le ${maintenant.toLocaleDateString('fr-FR')}`, 130, yPosition + 15);
        doc.text('Document confidentiel - Usage interne uniquement', 130, yPosition + 20);
        
        // Sauvegarder le PDF
        const nomFichier = `ATB_Demande_Carte_${selectedCarte.nom}_${selectedCarte.prenom}_${selectedCarte.id}.pdf`;
        doc.save(nomFichier);
        
        // Message de succès stylisé
        alert(`🎉 PDF généré avec succès !\n\n📁 Fichier: ${nomFichier}\n📊 Contenu: Fiche complète de demande de carte\n🔐 Sécurisé et prêt pour signature`);
        
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('❌ Erreur lors de la génération du PDF. Veuillez réessayer.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignUp) {
      setSignUpData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (currentPage === 'nouvelle-demande') {
      setDemandeData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isSignUp) {
      // Validation pour l'inscription
      if (!signUpData.nom.trim()) {
        newErrors.nom = 'Nom requis';
      }
      
      if (!signUpData.prenom.trim()) {
        newErrors.prenom = 'Prénom requis';
      }
      
      if (!signUpData.matricule.trim()) {
        newErrors.matricule = 'Matricule requis';
      }
      
      if (!signUpData.password) {
        newErrors.password = 'Mot de passe requis';
      } else if (signUpData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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
      }
      
      if (!formData.password) {
        newErrors.password = 'Mot de passe requis';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      }
    }
    
    return newErrors;
  };

  const validateDemandeForm = () => {
    const newErrors = {};
    
    if (!demandeData.nomClient.trim()) {
      newErrors.nomClient = 'Nom du client requis';
    }
    
    if (!demandeData.prenomClient.trim()) {
      newErrors.prenomClient = 'Prénom du client requis';
    }
    
    if (!demandeData.cin.trim()) {
      newErrors.cin = 'CIN requis';
    } else if (demandeData.cin.length !== 8) {
      newErrors.cin = 'Le CIN doit contenir 8 chiffres';
    }
    
    if (!demandeData.numCompte.trim()) {
      newErrors.numCompte = 'Numéro de compte requis';
    } else if (demandeData.numCompte.length < 10) {
      newErrors.numCompte = 'Le numéro de compte doit contenir au moins 10 chiffres';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      if (isSignUp) {
        // Logique d'inscription
        console.log('Tentative d\'inscription :', signUpData);
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
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
        // Logique de connexion
        console.log('Tentative de connexion :', formData);
        setUser({ matricule: formData.matricule });
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Fonction pour soumettre la demande de carte
  const handleDemandeSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateDemandeForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Nouvelle demande de carte :', demandeData);
      alert(`Demande de carte soumise avec succès !\n\nClient: ${demandeData.prenomClient} ${demandeData.nomClient}\nCIN: ${demandeData.cin}\nCompte: ${demandeData.numCompte}\nType: ${demandeData.typeCarte}\nDate: ${demandeData.dateDemande}`);
      
      // Reset form et retour au dashboard
      setDemandeData({
        nomClient: '',
        prenomClient: '',
        cin: '',
        numCompte: '',
        typeCarte: 'visa-electron-debit',
        dateDemande: new Date().toISOString().split('T')[0]
      });
      setCurrentPage('dashboard');
      setErrors({});
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
                <span className="welcome-text">Bienvenue, {user.matricule}</span>
                <button 
                  onClick={() => setUser(null)} 
                  className="logout-btn"
                >
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            <div className="form-container">
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
                      onChange={handleChange}
                      className={errors.nomClient ? 'error' : ''}
                      placeholder="Entrez le nom du client"
                      required
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
                      onChange={handleChange}
                      className={errors.prenomClient ? 'error' : ''}
                      placeholder="Entrez le prénom du client"
                      required
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
                      onChange={handleChange}
                      className={errors.cin ? 'error' : ''}
                      placeholder="12345678"
                      maxLength="8"
                      pattern="[0-9]{8}"
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
                      onChange={handleChange}
                      className={errors.numCompte ? 'error' : ''}
                      placeholder="1234567890123"
                      minLength="10"
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
                      onChange={handleChange}
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
      const totalCartes = stockData.length;
      const cartesDelivrees = stockData.filter(carte => carte.etat === 'délivré').length;
      const cartesEnStock = stockData.filter(carte => carte.etat === 'en stock').length;
      const cartesEnCours = stockData.filter(carte => carte.etat === 'en cours').length;

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
                <span className="welcome-text">Bienvenue, {user.matricule}</span>
                <button 
                  onClick={() => setUser(null)} 
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

            <div className="stock-table-container">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Type de carte</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>CIN</th>
                    <th>État</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((carte) => {
                    return (
                      <tr key={carte.id} className={`row-${carte.etat.replace(' ', '-')}`}>
                        <td className="carte-nom">{carte.typeCarte}</td>
                        <td className="user-nom">{carte.nom}</td>
                        <td className="user-prenom">{carte.prenom}</td>
                        <td className="user-cin">{carte.cin}</td>
                        <td>
                          <span className={`status-badge ${carte.etat.replace(' ', '-')}`}>
                            {carte.etat.charAt(0).toUpperCase() + carte.etat.slice(1)}
                          </span>
                        </td>
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
                <span className="welcome-text">Bienvenue, {user.matricule}</span>
                <button 
                  onClick={() => setUser(null)} 
                  className="logout-btn"
                >
                  <span>Se déconnecter</span>
                </button>
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            <div className="page-header">
              <button 
                onClick={() => setCurrentPage('stock')} 
                className="back-btn"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 12H5"/>
                  <path d="m12 19-7-7 7-7"/>
                </svg>
                Retour au stock
              </button>
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
              <span className="welcome-text">Bienvenue, {user.matricule}</span>
              <button 
                onClick={() => setUser(null)} 
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

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">247</div>
              <div className="stat-label">Demandes traitées</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,350</div>
              <div className="stat-label">Cartes en stock</div>
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
    <div className="App">
      <div className="login-container">
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
              // Formulaire d'inscription
              <>
                <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={signUpData.nom}
                    onChange={handleChange}
                    className={errors.nom ? 'error' : ''}
                    placeholder="Entrez votre nom"
                  />
                  {errors.nom && <span className="error-message">{errors.nom}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={signUpData.prenom}
                    onChange={handleChange}
                    className={errors.prenom ? 'error' : ''}
                    placeholder="Entrez votre prénom"
                  />
                  {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="matricule">Matricule</label>
                  <input
                    type="text"
                    id="matricule"
                    name="matricule"
                    value={signUpData.matricule}
                    onChange={handleChange}
                    className={errors.matricule ? 'error' : ''}
                    placeholder="Entrez votre matricule"
                  />
                  {errors.matricule && <span className="error-message">{errors.matricule}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={signUpData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Entrez votre mot de passe"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                  
                  {/* Indicateur de force du mot de passe */}
                  {signUpData.password && (
                    <div className="password-strength">
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
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={signUpData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirmez votre mot de passe"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
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
                    onChange={handleChange}
                    className={errors.matricule ? 'error' : ''}
                    placeholder="Entrez votre matricule"
                  />
                  {errors.matricule && <span className="error-message">{errors.matricule}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Entrez votre mot de passe"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
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
