import React, { useState } from 'react';
import './App.css';
import atbLogo from './atb.png';

function App() {
  // État pour gérer l'utilisateur connecté
  const [user, setUser] = useState(null);
  
  // État pour basculer entre connexion et inscription
  const [isSignUp, setIsSignUp] = useState(false);
  
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isSignUp) {
      setSignUpData(prev => ({
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

  // Si l'utilisateur est connecté, afficher la page d'accueil
  if (user) {
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
                  <span>• Demande rapide</span>
                  <span>• Attribution d’un emplacement physique de la carte</span>
                  <span>• Processus rapide et sécurisé</span>
                </div>
              </div>
              <button className="action-button add-button">
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
                <h3>Stock des Cartes</h3>
                <p>Consultez le stock disponible et les statistiques</p>
                <div className="card-features">
                  <span>• Vue d'ensemble</span>
                  <span>• Statistiques détaillées</span>
                  <span>• Alertes de stock</span>
                </div>
              </div>
              <button className="action-button stock-button">
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

// Styles inline pour les éléments après connexion
const styles = {
  header: {
    backgroundColor: "#A51C30",
    color: "#fff",
    padding: "1rem",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  footer: {
    backgroundColor: "#A51C30",
    color: "#fff",
    textAlign: "center",
    padding: "0.8rem",
    position: "fixed",
    bottom: 0,
    width: "100%",
  },
};

export default App;
