const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class Employee {
  constructor(matricule, nom, prenom, mdp) {
    this.matricule = matricule;
    this.nom = nom;
    this.prenom = prenom;
    this.mdp = mdp;
  }

  // Créer un nouvel employé
  static async create(employeeData) {
    const { matricule, nom, prenom, password } = employeeData;
    
    try {
      // Convertir le matricule en entier
      const matriculeInt = parseInt(matricule, 10);
      
      if (isNaN(matriculeInt) || matriculeInt < 100000 || matriculeInt > 999999) {
        throw new Error('Le matricule doit être un nombre de 6 chiffres');
      }

      // Vérifier si le matricule existe déjà
      const existingEmployee = await this.findByMatricule(matriculeInt);
      if (existingEmployee) {
        throw new Error('Un employé avec ce matricule existe déjà');
      }

      // Hacher le mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insérer le nouvel employé
      const query = `
        INSERT INTO employes (matricule, nom, prenom, mdp) 
        VALUES (?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [matriculeInt, nom, prenom, hashedPassword]);
      
      return {
        matricule: matriculeInt,
        nom,
        prenom,
        message: 'Employé créé avec succès'
      };
    } catch (error) {
      throw error;
    }
  }

  // Trouver un employé par matricule
  static async findByMatricule(matricule) {
    try {
      // Convertir en entier si c'est une chaîne
      const matriculeInt = typeof matricule === 'string' ? parseInt(matricule, 10) : matricule;
      
      const query = 'SELECT * FROM employes WHERE matricule = ?';
      const [rows] = await pool.execute(query, [matriculeInt]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Vérifier les identifiants de connexion
  static async authenticate(matricule, password) {
    try {
      // Convertir en entier si c'est une chaîne
      const matriculeInt = typeof matricule === 'string' ? parseInt(matricule, 10) : matricule;
      
      const employee = await this.findByMatricule(matriculeInt);
      if (!employee) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, employee.mdp);
      if (!isPasswordValid) {
        return null;
      }

      // Retourner les données de l'employé sans le mot de passe
      const { mdp, ...employeeWithoutPassword } = employee;
      return employeeWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Obtenir tous les employés
  static async getAll() {
    try {
      const query = 'SELECT matricule, nom, prenom FROM employes ORDER BY nom, prenom';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un employé
  static async update(matricule, updateData) {
    try {
      const { nom, prenom, password } = updateData;
      let query = 'UPDATE employes SET nom = ?, prenom = ?';
      let params = [nom, prenom];

      // Si un nouveau mot de passe est fourni
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', mdp = ?';
        params.push(hashedPassword);
      }

      query += ' WHERE matricule = ?';
      params.push(matricule);

      const [result] = await pool.execute(query, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Employé non trouvé');
      }

      return { message: 'Employé mis à jour avec succès' };
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un employé
  static async delete(matricule) {
    try {
      const query = 'DELETE FROM employes WHERE matricule = ?';
      const [result] = await pool.execute(query, [matricule]);
      
      if (result.affectedRows === 0) {
        throw new Error('Employé non trouvé');
      }

      return { message: 'Employé supprimé avec succès' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Employee;
