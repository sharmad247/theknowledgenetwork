var express = require("express");
var bodyparser = require('body-parser');
var app = express();
var pubmed = require('./pubmed')
const util = require('util');



var port = process.env.port || 3000;
var path = require("path");

app.use(bodyparser.urlencoded({extended: true}));

app.use(express.static('public'));
app.get('/authors', function(req, res){
	pubmed.findAuthorsWithTopic(req.query.topic, function(result){
		res.send(result);
	});
})

app.get('/login', function(req,res){
    res.sendFile(path.join(__dirname, 'public', 'signin.html'));
})

app.post('/login', function(req,res){
    console.log(req.body);
})

app.get('/success', function(req,res){
    res.sendfile(path.join(__dirname, 'public', 'index.html'));
})

app.listen(port);
console.log("Server running at http://localhost:" + port);
