const db = require('../../connection/database')

class CarregarChamados {
  carregarChamados(idUsuario) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idAparelho, idEndereco, sala, descricao FROM Chamado WHERE idUsuario = ? and situacao = "Pendente" or situacao = "Em Andamento"', [idUsuario],
      async (error, results) => {
        if(error) {
          reject(error)
          throw error
        } else {
          for(let i=0; i<results.length; i++) {
            results[i].idAparelho = await this.requisitarNomeDoAparelho(results[i].idAparelho)
            results[i].idEndereco = await this.requisitarNomeDoBloco(results[i].idEndereco)
          }
          resolve(results)
        }
      })
    })
  }

  requisitarNomeDoAparelho(idAparelho) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT aparelho FROM Aparelho WHERE idAparelho = ?', [idAparelho],
      (error, results) => {
        if (error) {
          reject(error)
          throw error
        } else {
          resolve(results[0].aparelho)
        }
      })
    })
  }
  
  requisitarNomeDoBloco(idEndereco) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT bloco FROM Endereco WHERE idEndereco = ?', [idEndereco],
      (error, results) => {
        if (error) {
          reject(error)
          throw error
        } else {
          resolve(results[0].bloco)
        }
      })
    })
  }

  requisitarNomeDoProfessor(idUsuario) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT nome FROM Usuario WHERE idUsuario = ?', [idUsuario],
      (err, results) => {
        if(err) {
          reject(err)
        } else {
          resolve(results[0].nome)
        }
      })
    })
  }

  requisitarNomeDoSetor(idSetor) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT setor FROM Setor WHERE idSetor = ?', [idSetor],
      (err, results) => {
        if(err) {
          reject(err)
        } else {
          resolve(results[0].setor)
        }
      })
    })
  }

  carregarTodosChamados() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Chamado WHERE situacao = "Pendente" or situacao = "Em Andamento"',
      async (error, results) => {
        if(error) {
          reject(error)
          throw error
        } else {
          for(let i=0; i<results.length; i++) {
            let aparelho = await this.requisitarNomeDoAparelho(results[i].idAparelho)
            let bloco = await this.requisitarNomeDoBloco(results[i].idEndereco)

            results[i]['aparelho'] = aparelho
            results[i]['bloco'] = bloco
          }
          resolve(results)
        }
      })
    })
  }

  carregarChamadoPeloID(idChamado) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Chamado WHERE idChamado = ?', [idChamado],
      async (error, results) => {
        if(error) {
          reject(error)
          throw error
        } else {
          for(let i=0; i<results.length; i++) {
            let aparelho = await this.requisitarNomeDoAparelho(results[i].idAparelho)
            let bloco = await this.requisitarNomeDoBloco(results[i].idEndereco)
            let professor = await this.requisitarNomeDoProfessor(results[i].idUsuario)
            let setor = await this.requisitarNomeDoSetor(results[i].idSetor)
  
            results[i]['aparelho'] = aparelho
            results[i]['bloco'] = bloco
            results[i]['professor'] = professor
            results[i]['setor'] = setor
          }
          resolve(results)
        }
      })
    })
  }
}

module.exports = CarregarChamados