const db = require('../../connection/database')

class ChamadoOpcoesService {
  async carregarSetores() {
    try {
      const query = 'SELECT setor FROM Setor';

      const [rows] = await db.conn.promise().query(query);
      return rows

    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const chamadoOpcoesService = new ChamadoOpcoesService()
chamadoOpcoesService.carregarSetores();