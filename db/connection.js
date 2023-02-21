const mysql = require('mysql2')

// Creates Connection to database
const connection = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Tania@1997',
      database: 'employeeTracker_db'
    },
  );

  connection.connect(function (error) {
    if (error) throw error;
  })
  module.exports = connection;