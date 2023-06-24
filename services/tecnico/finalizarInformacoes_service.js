const db = require('../../connection/database')

class FinalizarInformacoes {
  requisitarInformacoesDoChamado(idChamado) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Chamado WHERE idChamado = ?', [idChamado], async (err, results) => {
        if(err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }

  requisitarChamadoID(idUsuario) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT idChamado FROM tecnico_chamado WHERE idUsuario = ? ORDER BY idUsuario DESC LIMIT 1',
      [idUsuario], (err, results) => {
        if(err) {
          reject(err)
        } else {
          resolve(results[0].idChamado)
        }
      })
    })
  }

  requisitarInformacoesDoUsuario(idUsuario) {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Usuario WHERE idUsuario = ?', [idUsuario], (err, results) => {
        if(err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
}

module.exports = FinalizarInformacoes