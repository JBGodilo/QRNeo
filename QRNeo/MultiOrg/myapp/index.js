var express = require('express');        // call express
var app = express();                 // define our app using express

const qrneonetwork = require('./qrneonetwork')

// instantiate the app
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/getalluser', function (req, res) {
    console.log("getting all users from database: ");
    const handler = new qrneonetwork('admin');


    handler.init().then(function(){
        return handler.queryAllUser()
    }).then(function () {
        res.status(200).json({ response: 'success', responsecode: 200 })
    }).catch(function(err){
        res.status(500).json({error: err.toString()})
    })
    
})

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

