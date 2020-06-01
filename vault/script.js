"use strict";

//============================ functions for registering a user =====================

function appear(hide, show) {
  document.getElementById(hide).style.display = "none";
  document.getElementById(show).style.display = "flex";
}

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


function checkPassword(userPass) {
  var capitals = 0;
  var numbers = 0;
  var special = 0;

  //check length of password
  var n = userPass.length;
  if (n < 8) {
    return false;
  }

  //check for 2 capitals, 2 special chars, and 2 numbers
  for (var i = 0; i < n; i++) {
    var currentChar = userPass.charCodeAt(i);

    //check for capital
    if (currentChar >= 65 && currentChar <= 90) {
      capitals++;
    }

    //check for numbers
    if (currentChar >= 48 && currentChar <= 57) {
      numbers++;
    }

    //check for special characters
    if (currentChar >= 33 && currentChar <= 47) {
      special++;
    }
    if (currentChar >= 58 && currentChar <= 64) {
      special++;
    }
    if (currentChar >= 91 && currentChar <= 96) {
      special++;
    }
    if (currentChar >= 123 && currentChar <= 126) {
      special++;
    }
  }

  //final check!
  if (capitals < 1 || numbers < 1 || special < 1) {
    return false;
  }

  return true;
}


//creates random string! of size 11
function randomString(){
  let r = Math.random().toString(36).substr(2, );
  console.log("random string function produced: ", r);
  return r;
};


//return true if email and false if SMS
function isEmail(emailOrSMS) {
  for (var i = 0; i < emailOrSMS.length; i++) {
    if (emailOrSMS[i] == "@") return true;
  }

  return false;
}

function validEmail(inEmail) {
  var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inEmail.match(email)) {
    return true;
  } else {
    return false;
  }
}

function validPhone(inPhone) {
  var phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (inPhone.match(phone)) {
    return true;
  } else {
    return false;
  }
}

    document.querySelector("#save").addEventListener("click", () => { 
      var xmlhttp = new XMLHttpRequest();
  
        var to=document.getElementById("emailOrSMS").value; 
        //$("#message").text("Sending E-mail...Please wait");
      xmlhttp.open("POST", "https://dandelion-broad-cello.glitch.me/register.html",{to:to},function(data){
        if(data=="sent")
        {
          console.log("Message Sent")
            //$("#message").empty().html("<p>Email is been sent at "+to+" . Please check inbox !</p>");
        }

});
    });

// UPLOAD user data
// When the user hits the register button...
document.querySelector("#save").addEventListener("click", () => {
  let usr = document.getElementById("username").value;
  let pss = document.getElementById("userpassword").value;
  let psstwo = document.getElementById("userpassword2").value;
  
  //salt
  var randStr = randomString();

  //string of email or phone number
  let emailOrSMS = document.getElementById("emailOrSMS").value;

  console.log("Email or SMS ", emailOrSMS);

  //booleans
  var emailValidation = validEmail(emailOrSMS);
  var phoneValidation = validPhone(emailOrSMS);

  
  if (emailValidation == false && phoneValidation == false) {
    console.log("Email and Phone are invalid ", emailOrSMS);
    document.getElementById("error5").style.display = "flex";
    return null;
  }
  
  //figure out our authentication type
  var authenticationType;
  if(emailValidation == true){
    authenticationType = 'email';
  }
  if(phoneValidation == true){
    authenticationType = 'phone';
  }
  
  //authentication type, email/phonenumber, salt, if they have authemticated or not
  //const bcrypt = require('bcrypt');


  
  
  let data = {
    username: usr,
    password: pss,
    salt: randStr,
    authdata: emailOrSMS,
    authtype: authenticationType
  };

  /*
  console.log("THIS IS DATA");
  console.log(data); 
  console.log("END DATA");
  */

  //error handling for mising field
  if (data.username == "" || data.password == "" || data.passwordtwo == "") {
    document.getElementById("error3").style.display = "flex";
    return null;
  }
  document.getElementById("error3").style.display = "none";

  //error handling for mismatched passwords
  var error2 = pss.localeCompare(psstwo);
  if (error2 == 1 || error2 == -1) {
    document.getElementById("error2").style.display = "flex";
    return null;
  }
  document.getElementById("error2").style.display = "none";

  //error handling for passwords that arent strong enough
  var passwordStrength = checkPassword(data.password);
  if (passwordStrength == false) {
    document.getElementById("error4").style.display = "flex";
    return null;
  }
  document.getElementById("error4").style.display = "none";

  var string = randStr.concat(pss);
  
  data.password = hashCode(string);
  
  // new HttpRequest instance
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/registerUser"); //this line of code sends us to server.js

  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  var message;
  //callback function: from the server.js post request
  xmlhttp.onloadend = function(e) {
    console.log("START xmlhttp responce text");
    message = xmlhttp.responseText;
    console.log(message);
    console.log("END responce text");

    //error handling for username that is already taken
    var error1 = "SQLITE_CONSTRAINT: UNIQUE constraint failed: UserLogins.username";

    if (error1.localeCompare(message) == 0) {
      document.getElementById("error1").style.display = "flex";
    } else {
      document.getElementById("error1").style.display = "none";
      console.log("Got new item, inserted with username: " + message);
      window.location.href = "https://dandelion-broad-cello.glitch.me/registerSuccess.html";
    }
  };
  


  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
});
