var express = require("express");
var bodyparser = require('body-parser');
var app = express();
var pubmed = require('./pubmed')
var db = require('./db')
const util = require('util');

var port = process.env.PORT || 3000;
var path = require("path");

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('public'));
app.post('/authors', function(req, res){
    var r = req.body.topic;
	pubmed.findAuthorsWithTopic(r, function(result){
		res.send(result);
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
