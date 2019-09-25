var express       = require('express');        // call express
var app           = express();                 // define our app using express
var bodyParser    = require('body-parser');
var http          = require('http')
var fs            = require('fs');
var Fabric_Client = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// instantiate the app
var app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// this line requires and runs the code from our routes.js file and passes it app
require('./routes.js')(app);

// Save our port
var port = process.env.PORT || 80;

// Start the server and listen on port 
// app.listen(port,function(){
//     console.log("Live on port: " + port);
//   });
app.listen(port, (e) => {
  if (e) {
    return console.log(e)
  }
  console.log("Live on port: " + port);
})