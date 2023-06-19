const db = require('../../connection/database');

class UsuarioLoginService {
  async requisitarFuncaoUsuario(email, senha) {
    try {
      const query = 'SELECT funcao FROM Usuario WHERE email = ? AND senha = ?';
      const values = [email, senha];

      const [rows] = await db.conn.promise().query(query, values);

      if (rows.length > 0) {
        const { funcao } = rows[0];
        return funcao;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async requisitarIdUsuario(email, senha) {
    try {
      const query = 'SELECT idUsuario FROM Usuario WHERE email = ? AND senha = ?'
      const values = [email, senha]

      const [rows] = await db.conn.promise().query(query, values);

      if (rows.length > 0) {
        const { idUsuario } = rows[0];
        return  idUsuario ;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UsuarioLoginService;