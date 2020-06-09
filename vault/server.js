// server.js
// where your node app starts

// include modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sql = require('sqlite3').verbose();
const nodemailer = require('nodemailer');

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


//=================================== Next, set up Nodemailer transport ==============================================

function sendEmail(salt, email, username)
{
  
  var link = "https://dandelion-broad-cello.glitch.me/authentication.html?id=" + username;
  
  var smtpTransport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: "cybergangvault@gmail.com",
          pass: "Vault123!"
      }
  });


  let mailOptions = {
      from: 'cybergangvault@gmail.com', // TODO: email sender
      to: email, // TODO: email receiver
      subject: 'Authenticate Vault Account',
      text: 'Click the link below and use following code to authenticate your account.\n' + 'Code: '  + salt + '\nLink: ' + link
  };

  // Step 3
  smtpTransport.sendMail(mailOptions, (err, data) => {
      if (err) {
          return console.log('Error occurs');
      }
      return console.log('Email sent!!!');
  });
}

//=================================== Next, phone verification using twilio ==============================================

function phoneVerification(salt, number, username){
  const accountSid = 'AC502f8bf8ab68c82b8adaebe0652908f9';
  const authToken = 'eac5c0d12dc189d25343e815481a1875';
  const client = require('twilio')(accountSid, authToken);
  var link = "https://dandelion-broad-cello.glitch.me/authentication.html?id=" + username;

  client.messages
    .create({
       body: 'Click the link below and use following code to authenticate your account.\n' + 'Code: '  + salt + '\nLink: ' + link,
       from: '+12055093537',
       to: number
     })
    .then(message => console.log(message.sid));
}

//=================================== Next, the the POST AJAX query ==============================================


// Handle a POST request for inserting to database
//we are going to change this so that we insert a registered person into the database!
app.use(bodyParser.json());
// gets JSON data into req.body

app.post('/registerUser', function (req, res) {
  
  console.log('entering server app.post... req.body = ');
  console.log(req.body);
  
  //put new user into database!
  var userName = req.body.username;
  var userPassword = req.body.password;
  var userSalt = req.body.salt;
  var userAuthData = req.body.authdata;
  var userAuthType = req.body.authtype;
  var userAuthStatus = 0;
  
  cmd = "INSERT INTO userLogins (username, password, salt, authData, authType, authStatus) VALUES (?, ?, ?, ?, ?, ?) ";
  loginDB.run(cmd, userName, userPassword, userSalt, userAuthData, userAuthType, userAuthStatus, function(err) {
    if (err) {
      console.log("DB insert error", err.message);
      //display message to the user that the username is not unique 
      res.send(err.message);
    } else {
      
      if (userAuthType == 'email'){
        sendEmail(req.body.salt, req.body.authdata, req.body.username);
      }
      
      if(userAuthType == 'phone'){
        phoneVerification(req.body.salt, req.body.authdata, req.body.username);
      }
      
      res.send(userName);
    }
  });
  
});


app.use(bodyParser.json());
//finds the user given a primary key 
app.post('/findUser', function(req, res) {
  
  console.log(req.body.username);
  
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


//this changes only a single column at a time for a given user
app.post('/changeColumn', function(req, res) {
  console.log("ENTERING CHANGE COLUMN");
  
  //this might be wrong. make sure to check this later julia
  let xcmd = 'UPDATE UserLogins SET authStatus = ? WHERE username = ?';
  
  
  loginDB.get(xcmd, 1, req.body.username, function ( err, val) {
    if(err){
      console.log("error: ", err.message);
    } else {
      console.log('updated table');
      res.send(val); //i dont know what val would be in this situation 
    }
  });
  
});


//==========================================listen for requests :)=================================================

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

//=================================================Build database===================================================


// Actual table creation; only runs if DB is not found or empty
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
  const cmd = 'CREATE TABLE UserLogins ( username TEXT PRIMARY KEY UNIQUE, password TEXT, salt TEXT, authData TEXT, authType TEXT, authStatus INTEGER)';
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