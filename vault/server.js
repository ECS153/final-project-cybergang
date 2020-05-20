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


//this gets a row of data given a primary key
//we are going to change this code so it does something else after a user logs in
//but this is for later, we dont use this code right now. 
app.get("/showUserData", function(req, res) {
  
  let xcmd = 'SELECT * FROM userLogins WHERE username = ?';
  loginDB.get(xcmd, req.query.username, function ( err, val ) { //username might need to be changed to id for query reasons 
      if (err) { 
        console.log("error: ",err.message);
      }else { 
        console.log( "got: ", val); 
        res.send(val);
      }

  });
  
});


//=================================== Next, the the POST AJAX query ==============================================


// Handle a POST request for inserting POSTCARD to database
//we are going to change this so that we insert a registered person into the database!
app.use(bodyParser.json());
// gets JSON data into req.body
var usersName;
var usersPassword;
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
    } else {
      res.send(usersName);
    }
  });
  
});

app.post('/existingUser', function(req, res){
  console.log('entering server app.post... req.body = ');
  console.log(req.body);
  
  var usersName = req.body.username;
  var usersPassword = req.body.password;
  cmd = "SELECT username FROM userLogins";
  loginDB.run(cmd, usersName, usersPassword, function(err){
    if (err){
      console.log("error", err.message);
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