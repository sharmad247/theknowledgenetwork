var mysql = require('mysql');

var MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
var MYSQL_PORT = process.env.MYSQL_PORT || 8889;
var MYSQL_URL = process.env.CLEARDB_DATABASE_URL || 'mysql://admin:admin@' + MYSQL_HOST + ':' + MYSQL_PORT + '/icmr';
console.log('Database: ' + MYSQL_URL)

var connection = mysql.createConnection(MYSQL_URL);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

function validate(username, password, done) {
  connection.query("SELECT * FROM `user` WHERE `email` = '" + username + "'", function(err,rows) {
    if (err) {
    console.error(err);
    return done(false);
   }
    if (!rows.length) {
    console.log('loginMessage', 'No user found.');
    return done(false);
   }

   if ( rows[0].password == password) 
      done(true);
    else
      done(false);
  });
}

exports.validate = validate
