"use strict";

function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);       
      hash = ((hash<<5)-hash)+char;     
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
}



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
    console.log("START xmlhttp response text");
    message = xhr.responseText;
    let data = JSON.parse(xhr.responseText);
    console.log(data); //json object
    console.log("END response text");

    //we found the user, now check if passwords match
    

    var string = data.salt.concat(pss);
  
    var hashed_pss = hashCode(string);
    var result = comparePass(hashed_pss, data.password);
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
  
  console.log(entered);
  console.log(found);
  
  var result = entered.localeCompare(found);

  if (result == 0) {
    //passwords match
    console.log("passwords match!");
    return true;
  }
  console.log("passwords dont match!");
  return false;
}