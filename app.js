var express = require("express");
var app = express();
var pubmed = require('./pubmed')
const util = require('util');


var port = process.env.port || 3000;
var path = require("path");

app.use(express.static('public'));
app.get('/authors', function(req, res){
	pubmed.findAuthorsWithTopic(req.query.topic, function(result){
		res.send(result);
	});
})

app.listen(port);
console.log("Server running at http://localhost:" + port);

pubmed.findAuthorsWithTopic('cancer', function(x){
     console.log(util.inspect(x, false, null))
})