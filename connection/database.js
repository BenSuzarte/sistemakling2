const mysql = require('mysql2')
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Cascalheira12!',
  database: 'sistemakling'
})

module.exports = {mysql: mysql, conn: conn};