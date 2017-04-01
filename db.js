var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'admin',
    password: 'admin',
    database: 'icmr'
});
connection.connect();

function validate(username, password, done) {
    connection.query("SELECT * FROM `user` WHERE `email` = '" + username + "'",function(err,rows){


       if (err)
       {
            console.error(err);
           return done(false);
       }
        if (!rows.length) {
            console.log('loginMessage', 'No user found.'); // req.flash is the way to set flashdata using connect-flash
            return done(false); // req.flash is the way to set flashdata using connect-flash
       }

        console.log(rows[0].password, password);

       // if the user is found but the password is wrong
       if ( rows[0].password == password) {
        return done(true); // create the loginMessage and save it to session as flashdata
        }
        console.log('loginMessage', 'Oops! Wrong password.'); // create the loginMessage and save it to session as flashdata
       return done(false);
   });
}

exports.validate = validate
