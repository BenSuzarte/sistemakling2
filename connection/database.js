const mysql = require('mysql2')
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2546978',
  database: 'sistemakling'
})

module.exports = {mysql: mysql, conn: conn};