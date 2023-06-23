const db = require('../../connection/database')

class CarregarChamados {
  carregarChamadosProfessor(idUsuario) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idAparelho, idEndereco, sala, descricao FROM Chamado WHERE idUsuario = ?', [idUsuario],
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
}

module.exports = CarregarChamados