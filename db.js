var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'admin',
    password: 'admin',
    database: 'icmr'
});

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
