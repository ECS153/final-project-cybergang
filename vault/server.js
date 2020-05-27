// server.js
// where your node app starts

// include modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require('sqlite3').verbose();

const loginDB = new sql.Database("userLogins.db");////////////////////////////////////////////////////////////////////////


// begin constructing the server pipeline
const app = express();

// Serve static files out of public directory
app.use(express.static('public'));

// Handle GET request to base URL with no other route specified
// by sending login.html, the main page of the app
//Open the main page of our application! which is the login page.
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/login.html');
});




//=================================== Next, the the POST AJAX query ==============================================


// Handle a POST request for inserting POSTCARD to database
//we are going to change this so that we insert a registered person into the database!
app.use(bodyParser.json());
// gets JSON data into req.body

app.post('/registerUser', function (req, res) {
  
  console.log('entering server app.post... req.body = ');
  console.log(req.body);
  
  //put new user into database!
  var usersName = req.body.username;
  var usersPassword = req.body.password;
  
  cmd = "INSERT INTO userLogins (username, password) VALUES (?, ?) ";
  loginDB.run(cmd, usersName, usersPassword, function(err) {
    if (err) {
      console.log("DB insert error", err.message);
      //display message to the user that the username is not unique 
      res.send(err.message);
    } else {
      res.send(usersName);
    }
  });
  
});


app.use(bodyParser.json());
//finds the user given a primary key 
app.post('/findUser', function(req, res) {
  
  let xcmd = 'SELECT * FROM UserLogins WHERE username = ?';
  loginDB.get(xcmd, req.body.username, function ( err, val ) {    
      if (err) { 
        console.log("error: ",err.message);
      }else { 
        console.log( "got: ", val); 
        res.send(val); //send entire row
      }

  });
  
});


//==========================================listen for requests :)=================================================

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//=================================================Build database===================================================


// Actual table creation; only runs if "postcards.db" is not found or empty
// Does the database table exist?
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='UserLogins' ";
loginDB.get(cmd, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("No database file - creating one");
        createLoginDB();
    } else {
        console.log("Database file found");
    }
});


function createLoginDB() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  const cmd = 'CREATE TABLE UserLogins ( username TEXT PRIMARY KEY UNIQUE, password TEXT)';
  loginDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}


//============================================ error handling ========================================================

// custom 404 page (not a very good one...)
// last item in pipeline, sends a response to any request that gets here
app.all("*", function (request, response) { 
  response.status(404);  // the code for "not found"
  response.send("This is not the droid you are looking for"); 
});