const { pool } = require('../config/database');

class Carte {
  constructor(nom, prenom, cin, type, numCompte, emp, date, etat) {
    this.nom = nom;
    this.prenom = prenom;
    this.cin = cin;
    this.type = type;
    this.numCompte = numCompte;
    this.emp = emp;
    this.date = date;
    this.etat = etat;
  }

  // Créer une nouvelle demande de carte
  static async create(carteData) {
    const { nom, prenom, cin, type, numCompte, emp, date, etat = 'en_stock' } = carteData;
    
    try {
      // Validation du CIN (exactement 8 chiffres)
      const cinRegex = /^[0-9]{8}$/;
      if (!cinRegex.test(cin)) {
        throw new Error('Le CIN doit contenir exactement 8 chiffres');
      }

      // Validation du numéro de compte (10 à 20 chiffres)
      const compteRegex = /^[0-9]{10,20}$/;
      if (!compteRegex.test(numCompte)) {
        throw new Error('Le numéro de compte doit contenir entre 10 et 20 chiffres');
      }

      // Validation de l'emplacement (format: lettre + chiffre)
      const empRegex = /^[A-Za-z][0-9]{1,3}$/;
      if (!empRegex.test(emp)) {
        throw new Error('Format d\'emplacement invalide (ex: A1, B2, C10)');
      }

      // Vérifier si une carte existe déjà pour ce CIN et ce type
      const existingCarte = await this.findByCinAndType(cin, type);
      if (existingCarte) {
        throw new Error(`Une carte ${type} existe déjà pour ce client (CIN: ${cin})`);
      }

      // Insérer la nouvelle demande
      const query = `
        INSERT INTO cartes (nom, prenom, cin, type, numCompte, emp, date, etat) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await pool.execute(query, [nom, prenom, cin, type, numCompte, emp, date, etat]);
      
      return {
        id: result.insertId,
        nom,
        prenom,
        cin,
        type,
        numCompte,
        emp,
        date,
        etat,
        message: 'Demande de carte créée avec succès'
      };
    } catch (error) {
      throw error;
    }
  }

  // Trouver une carte par CIN et type
  static async findByCinAndType(cin, type) {
    try {
      const query = 'SELECT * FROM cartes WHERE cin = ? AND type = ?';
      const [rows] = await pool.execute(query, [cin, type]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Obtenir toutes les cartes
  static async getAll() {
    try {
      const query = 'SELECT * FROM cartes ORDER BY date DESC';
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Obtenir les cartes par état
  static async getByEtat(etat) {
    try {
      const query = 'SELECT * FROM cartes WHERE etat = ? ORDER BY date DESC';
      const [rows] = await pool.execute(query, [etat]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Trouver une carte par ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM cartes WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour l'état d'une carte
  static async updateEtat(id, nouvelEtat) {
    try {
      const etatsValides = ['en_stock', 'en_cours', 'delivree'];
      if (!etatsValides.includes(nouvelEtat)) {
        throw new Error('État invalide. États valides: en_stock, en_cours, delivree');
      }

      const query = 'UPDATE cartes SET etat = ? WHERE id = ?';
      const [result] = await pool.execute(query, [nouvelEtat, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Carte non trouvée');
      }

      return { message: 'État de la carte mis à jour avec succès' };
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour les informations d'une carte
  static async update(id, updateData) {
    try {
      const { nom, prenom, cin, type, numCompte, emp, etat } = updateData;
      
      const query = `
        UPDATE cartes 
        SET nom = ?, prenom = ?, cin = ?, type = ?, numCompte = ?, emp = ?, etat = ?
        WHERE id = ?
      `;
      
      const [result] = await pool.execute(query, [nom, prenom, cin, type, numCompte, emp, etat, id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Carte non trouvée');
      }

      return { message: 'Carte mise à jour avec succès' };
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une carte
  static async delete(id) {
    try {
      const query = 'DELETE FROM cartes WHERE id = ?';
      const [result] = await pool.execute(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Carte non trouvée');
      }

      return { message: 'Carte supprimée avec succès' };
    } catch (error) {
      throw error;
    }
  }

  // Statistiques des cartes
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          etat,
          COUNT(*) as count
        FROM cartes 
        GROUP BY etat
      `;
      
      const [rows] = await pool.execute(query);
      
      const stats = {
        total: 0,
        en_stock: 0,
        en_cours: 0,
        delivree: 0
      };

      rows.forEach(row => {
        stats[row.etat] = row.count;
        stats.total += row.count;
      });

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Carte;
