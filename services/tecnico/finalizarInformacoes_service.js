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

  requisitarTecnicoNomeID() {
    return new Promise((resolve, reject) => {
      db.conn.query('SELECT * FROM Usuario WHERE funcao = "TECNICO"',
      (err, results) => {
        if(err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
  concluirChamado(idUsuario, idChamado, dataFechamento, tempoDeRealizacao, relatorio) {
    return new Promise((resolve, reject) => {
      db.conn.query('UPDATE Chamado SET situacao = "Finalizado", dataFechamento = ?, tempoDeRealizacao = ?, relatorio = ?, idTecnicoFinalizado = ? WHERE idChamado = ?',
      [dataFechamento, tempoDeRealizacao, relatorio, idUsuario, idChamado],
      () => {
        db.conn.query('UPDATE Disponibilidade SET disponibilidade = "ATIVO" WHERE idUsuario = ?', [idUsuario])
      })
    }) 
  }

  capturarDataHoraLocal() {
    let dataHoraAtual = new Date();

    let ano = dataHoraAtual.getFullYear();
    let mes = String(dataHoraAtual.getMonth() + 1).padStart(2, '0');
    let dia = String(dataHoraAtual.getDate()).padStart(2, '0');
    let hora = String(dataHoraAtual.getHours()).padStart(2, '0');
    let minuto = String(dataHoraAtual.getMinutes()).padStart(2, '0');
    let segundo = String(dataHoraAtual.getSeconds()).padStart(2, '0');

    let dataHoraSQL = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;

    return dataHoraSQL
  }
}

module.exports = FinalizarInformacoes