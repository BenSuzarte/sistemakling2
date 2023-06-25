const db = require('../../connection/database')

class UsuarioCrudService {
  async cadastrarUsuario(funcao, nome, email, telefone) {
    const senha = '#654321'
    try {
      db.conn.query('insert into Usuario (nome, email, senha, telefone, funcao) values (?, ?, ?, ?, ?)',
      [nome, email, senha, telefone, funcao])

      try {
        const idTecnico = await this.capturarIdTecnico(email)

        if (funcao === 'TECNICO') {
          db.conn.query('insert into Disponibilidade (idUsuario) values (?)', [idTecnico])
        }
      } catch (error) {
        console.log(error)
      }

    } catch (error) {
      console.log(error)
      console.log('Falha ao cadastrar usuário!')
    }
  }

  carregarUsuarios() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Usuario ORDER BY funcao ASC', (error, results) => {
        if (error) {
          reject(error);
          throw error;
        } else {
          resolve(results);
        }
      });
    });
  }

  capturarIdTecnico(email) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idUsuario FROM Usuario WHERE email = ?', [email], (error, results) => {
        if (error) {
          reject(error)
          throw error;
        } else {
          resolve(results[0].idUsuario)
        }
      })
    })
  }

  deletarUsuario(idUsuario) {
    db.conn.query('DELETE FROM Usuario WHERE idUsuario = ?', [idUsuario])
  }
}

module.exports = UsuarioCrudService