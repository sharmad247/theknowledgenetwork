//import express
var express = require("express");
var app = express();
//set port number
var port = process.env.port || 3000;
 //import path module for serving static files
 var path = require("path");

 //usse express's static middleware to serve files from the directory public.
 app.use(express.static('public'));

  app.listen(port);
  console.log("Server running at http://localhost:" + port);
