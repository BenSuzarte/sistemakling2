const db = require('../../connection/database')

class ChamadoEnviarService {
  async chamadoEnviar(setor, bloco, sala, aparelho, numeroAparelho, descricao, idUsuario) {
    try {
      const idSetor = await this.requisitarIdSetor(setor)
      const idEndereco = await this.requisitarIdBloco(bloco)
      const idAparelho = await this.requisitarIdAparelho(aparelho, numeroAparelho)
      const numeroDaSalaVerificado = await this.verificarNumeroDaSala(sala, idEndereco)

      db.conn.query('INSERT INTO Chamado (idSetor, idEndereco, idAparelho, idUsuario, descricao, sala) VALUES (?, ?, ?, ?, ?, ?)',
      [idSetor, idEndereco, idAparelho, idUsuario, descricao, numeroDaSalaVerificado])

    } catch (error) {
      console.log(error)
    }
  }

  requisitarIdSetor(setor) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idSetor FROM Setor WHERE setor = ?', [setor], (error, results) => {
        if (error) {
          reject(error)
          throw error;
        } else {
          resolve(results[0].idSetor)
        }
      })
    })
  }

  requisitarIdAparelho(aparelho, numeroAparelho) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idAparelho FROM Aparelho WHERE aparelho = ?', [aparelho], async (error, results) => {
        if (error) {
          reject(error)
          throw error;
        } else {
          const numeroAparelhoVerificado = await this.verificarQuantidadeDeAparelhos(numeroAparelho, results[0].idAparelho)
          if (numeroAparelhoVerificado !== 'error') {
            resolve(results[0].idAparelho)
          }
        }
      })
    })
  }

  requisitarIdBloco(bloco) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idEndereco FROM Endereco WHERE bloco = ?', [bloco], (error, results) => {
        if (error) {
          reject(error)
          throw error;
        } else {
          resolve(results[0].idEndereco)
        }
      })
    })
  }

  verificarQuantidadeDeAparelhos(numeroAparelho, idAparelho) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT quantidade FROM Aparelho WHERE idAparelho = ?', [idAparelho], (error, results) => {
        if (error) {
          reject('error')
        } else {
          if (numeroAparelho <= results[0].quantidade && numeroAparelho > 0) {
            resolve(numeroAparelho)
          }
        }
      })
    })
  }

  verificarNumeroDaSala(sala, idEndereco) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT salas FROM Endereco WHERE idEndereco = ?', [idEndereco], (error, results) => {
        if (error) {
          reject(error)
          throw error;
        } else {
          if (sala <= results[0].salas && sala > 0) {
            resolve(sala)
          }
        }
      })
    })
  }
}

module.exports = ChamadoEnviarService