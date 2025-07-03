import React, { useState } from 'react';
import './App.css';
import atbLogo from './atb.png';

function App() {
  // État pour gérer l'utilisateur connecté
  const [user, setUser] = useState(null);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    if (!formData.username.trim()) {
      newErrors.username = 'Nom d\'utilisateur requis';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // ici tu pourras faire appel à une API plus tard
      console.log('Tentative de connexion :', formData);
      setUser({ username: formData.username });
    } else {
      setErrors(newErrors);
    }
  };

  // Si l'utilisateur est connecté, afficher la page d'accueil
  if (user) {
    return (
      <div>
        <header style={styles.header}>
          Arab Tunisian Bank
        </header>
        <main style={{ padding: "2rem", minHeight: "80vh", backgroundColor: "#f5f5f5" }}>
          <h2>Bienvenue sur l'espace cartes ATB, {user.username} !</h2>
          <p>Vous êtes maintenant connecté à votre espace de gestion des cartes bancaires.</p>
          <button 
            onClick={() => setUser(null)} 
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#A51C30",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Se déconnecter
          </button>
        </main>
        <footer style={styles.footer}>
          &copy; {new Date().getFullYear()} Arab Tunisian Bank. Tous droits réservés.
        </footer>
      </div>
    );
  }

  // Sinon, afficher le formulaire de connexion
  return (
    <div className="App">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="atb-logo">
              <img src={atbLogo} alt="ATB Logo" className="atb-logo-image" />
              <h1>ATB</h1>
              <span>Arab Tunisian Bank</span>
            </div>
            <h2>Espace Cartes ATB</h2>
            <p>Connectez-vous à votre espace de gestion</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
                placeholder="Entrez votre nom d'utilisateur"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
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

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" className="forgot-password">Mot de passe oublié ?</a>
            </div>

            <button type="submit" className="login-button">
              Se connecter
            </button>
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
