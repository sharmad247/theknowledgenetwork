var express = require("express");
var bodyparser = require('body-parser');
var pubmed = require('./pubmed');
var db = require('./db');
var ejs = require('ejs');
const util = require('util');

var port = process.env.PORT || 3000;
var path = require("path");
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname,'views'));

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('public'));
app.post('/authors', function(req, res){
    var r = req.body.topic;
    var database = req.body.database;
    var sort = req.body.sort;
	pubmed.findAuthorsWithTopic(r, database, sort, function(result){
        res.render('search', {'authors': result});
	});
});

app.get('/login', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

app.post('/login', function(req,res){
    db.validate(req.body.username, req.body.password, function(flag) {
        if(flag){
            res.redirect('/');
        }
        else {
            console.log("Bad cred")
            res.redirect('/login');
        }
    });

});


app.listen(port);
console.log("Server running at http://localhost:" + port);
