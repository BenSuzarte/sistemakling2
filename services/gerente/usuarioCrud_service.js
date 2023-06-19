const db = require('../../connection/database')

class UsuarioCrudService {
  cadastrarUsuario(funcao, nome, email, telefone) {
    const senha = '#654321'
    try {
      db.conn.query('insert into Usuario (nome, email, senha, telefone, funcao) values (?, ?, ?, ?, ?)',
      [nome, email, senha, telefone, funcao])

      console.log(nome, email, senha, telefone, funcao)
    } catch (error) {
      console.log('Falha ao cadastrar usuário!')
    }
  }

  async carregarUsuarios() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Usuario ORDER BY funcao ASC', (error, results) => {
        if (error) {
          reject(error);
          throw error;
        } else {
          console.log(results);
          resolve(results);
        }
      });
    });
  }
}

module.exports = UsuarioCrudService