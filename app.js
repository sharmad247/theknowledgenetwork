//import express
var express = require("express");
var app = express();
//set port number
var port = 3000;
 //import path module for serving static files
 var path = require("path");

 //usse express's static middleware to serve files from the directory public.
 app.use(express.static('public'));

 //route for homepage
 app.get("/", function(req, res){
     res.sendFile('index.html');
 });
 //route for signin homepage
  app.get("/signin.html", function(req,res){
      res.sendFile('signin.html');
  });

  app.get("/search.html", function(req,res){
      res.sendFile('search.html');
  });

  app.listen(3000);
  console.log("Server running at http://localhost:3000");
