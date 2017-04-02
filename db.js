var mysql = require('mysql');

var MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
var MYSQL_PORT = process.env.MYSQL_PORT || 8889;
var MYSQL_URL = process.env.CLEARDB_DATABASE_URL || 'mysql://admin:admin@' + MYSQL_HOST + ':' + MYSQL_PORT + '/icmr';

var connectionPool = mysql.createPool(MYSQL_URL);

function validate(username, password, done) {
  connectionPool.getConnection(function(err, connection){
    var result = false;
    if(err) {
      console.error(err);
      done(false);
    }
    
    connection.query("SELECT * FROM `user` WHERE `email` = '" + username + "'", function(err,rows) {
      if (err)
        console.error(err);
      else if (rows.length !== 1)
        console.log('loginMessage', 'No user found.');
      else if ( rows[0].password == password) 
        result = true;

      connection.release();
      done(result);
    });
  })
}

exports.validate = validate
