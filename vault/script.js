"use strict";

// UPLOAD user data
// When the user hits the register button...

//TODO
//1. make sure the username doesnt already exist
//2. make sure the passwords match

//for now lets just save stuff to the databse blindly
document.querySelector("#save").addEventListener("click", () => {
  let usr = document.getElementById("username").value;
  let pss = document.getElementById("userpassword").value;
  let psstwo = document.getElementById("userpassword2").value;

  let data = {
    username: usr,
    password: pss,
    passwordtwo: psstwo
  };
  console.log("THIS IS DATA");
  console.log(data); //prints out to the console
  console.log("END DATA");

  // new HttpRequest instance
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/registerUser"); //this line of code send us to server.js
  xmlhttp.open("GET", "/existingUser"); //grabs an existing user

  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  var r;
  // setup callback function: from the post request
  xmlhttp.onloadend = function(e) {
    r = xmlhttp.responseText;

    //this prints out on the console, the user does not see it
    console.log("Got new item, inserted with username: " + r);

    //redirects us to the register Success webpage
    window.location.href =
      "https://dandelion-broad-cello.glitch.me/registerSuccess.html";
  };

  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
});



function findUser() {
  
};