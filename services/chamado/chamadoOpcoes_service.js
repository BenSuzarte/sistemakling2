const db = require('../../connection/database')

class ChamadoOpcoesService {
  carregarSetores() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT setor FROM Setor', (error, results) => {
        if (error) {
          reject(error);
          throw error;
        } else {
          resolve(results);
        }
      });
    });
  }

  carregarBlocos() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT bloco FROM Endereco', (error, results) => {
        if (error) {
          reject(error);
          throw error;
        } else {
          resolve(results);
        }
      });
    });
  }

  carregarAparelhos() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT aparelho FROM Aparelho', (error, results) => {
        if (error) {
          reject(error);
          throw error;
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = ChamadoOpcoesService;