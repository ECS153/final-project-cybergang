"use strict";

function findUser() {
  let usr = document.getElementById("username").value;
  let pss = document.getElementById("password").value;

  //need to implement password hashing

  //find it!
  let data = {
    username: usr
  };

  // new HttpRequest instance
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/findUser"); //this line of code sends us to server.js
  // important to set this for body-parser
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  var message;
  //callback function: from the server.js post request
  xhr.onloadend = function(e) {
    console.log("START xmlhttp responce text");
    message = xhr.responseText;
    let data = JSON.parse(xhr.responseText);
    console.log(data); //json object
    console.log("END responce text");

    //we found the user, now check if passwords match
    var result = comparePass(pss, data.password);
    if (result == true) {
      //we are going to need to put the users name into the url
      window.location.href =
        "https://dandelion-broad-cello.glitch.me/loginSuccess.html";
    } else if (result == false) {
      //show error message
      document.getElementById("loginError").style.display = "flex";
    }
  };

  // all set up!  Send off the HTTP request
  xhr.send(JSON.stringify(data));
}

function comparePass(entered, found) {
  var result = entered.localeCompare(found);

  if (result == 0) {
    //passwords match
    console.log("passwords match!");
    return true;
  }
  console.log("passwords dont match!");
  return false;
}

//might not end up here
const bcrypt = require('bcrypt')

const rounds = 10
const password = 'ssseeeecrreeet'

bcrypt.hash(password, rounds, (err, hash) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(hash)
  
  bcrypt.compare(password, hash, (err, res) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(res)
  })

})

const hashPassword = async () => {
  const hash = await bcrypt.hash(password, rounds)
  console.log(hash)
  console.log(await bcrypt.compare(password, hash))
}

hashPassword()
