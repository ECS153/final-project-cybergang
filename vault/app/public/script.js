"use strict";



//============================ functions for registering a user =====================

function appear(hide, show){
  document.getElementById(hide).style.display = 'none';
  document.getElementById(show).style.display = 'flex';
}


function checkPassword(userPass){
  var capitals = 0;
  var numbers = 0;
  var special = 0;
  
  //check length of password
  var n = userPass.length;
  if(n < 8){
    return false;
  }
  
  //check for 2 capitals, 2 special chars, and 2 numbers
  for(var i = 0; i < n; i++){
    var currentChar = userPass.charCodeAt(i);
    
    //check for capital
    if((currentChar >= 65) && (currentChar <= 90)){
      capitals++;
    }
    
    //check for numbers
    if((currentChar >= 48) && (currentChar <= 57)){
      numbers++;
    }
    
    //check for special characters
    if((currentChar >= 33) && (currentChar <= 47)){
      special++;
    }
    if((currentChar >= 58) && (currentChar <= 64)){
      special++;
    }
    if((currentChar >= 91) && (currentChar <= 96)){
      special++;
    }
    if((currentChar >= 123) && (currentChar <= 126)){
      special++;
    }
    
  }
  
  /*
  console.log("CHARACTER COUNT");
  console.log(capitals);
  console.log(numbers);
  console.log(special);
  console.log("CHARACTER COUNT END");
  */
  
  if((capitals < 2) || (numbers < 2) ||(special < 2)){
    return false;
  }
  
  return true;
  
}

//return true if email and false if SMS
function isEmail(emailOrSMS){
    
  for(var i = 0; i < emailOrSMS.length; i++)
    {
      if(emailOrSMS[i] == '@')
        return true;
    }
  
  return false;
  
}


function ValidateEmail(inputtxt) 
{
  var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (inputtxt.match(email))
  {
    return (true)
  }
  else
  {
    console.log("You have entered an invalid email address!");
    document.getElementById('error5').style.display = "flex";
    return (false)
  }
}


function phonenumber(inputtxt)
{
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(inputtxt.match(phoneno))
    {
        return (true);
    }
    else
    {
        console.log("Invalid phone number!");
        document.getElementById('error5').style.display = "flex";
        return false;
    }
}


// UPLOAD user data
// When the user hits the register button...
document.querySelector("#save").addEventListener("click", () => {
  let usr = document.getElementById("username").value;
  let pss = document.getElementById("userpassword").value;
  let psstwo = document.getElementById("userpassword2").value;
  
  let emailOrSMS = document.getElementById("emailOrSMS").value;
  
  console.log("Email or SMS ", emailOrSMS);
  
  var emailValidation = ValidateEmail(document.getElementById("emailOrSMS").value);
  if(emailValidation == false)
  {
    var phoneValidation = phonenumber(document.getElementById("emailOrSMS").value);
  }
  
  if (!document.getElementById("emailOrSMS").value.match(/\S/)) 
  {
    document.getElementById('error3').style.display = "flex";
    return null;
  } 
  
  
  let data = {
    username: usr,
    password: pss,
    passwordtwo: psstwo
  };
  
  /*
  console.log("THIS IS DATA");
  console.log(data); 
  console.log("END DATA");
  */
  
  //error handling for mising field
  if((data.username == "") || (data.password == "")  || (data.passwordtwo == "") ){
    document.getElementById('error3').style.display = "flex";
    return null;
  }
  document.getElementById('error3').style.display = "none";
  
  
  //error handling for mismatched passwords
  var error2 = (data.password).localeCompare(data.passwordtwo);
  if((error2 == 1) || (error2 == -1)){ 
    document.getElementById('error2').style.display = "flex";
    return null;
  }
  document.getElementById('error2').style.display = "none";
  
  
  //error handling for passwords that arent strong enough 
  var passwordStrength = checkPassword(data.password);
  if(passwordStrength == false){
    document.getElementById('error4').style.display = "flex";
    return null;
  }
  document.getElementById('error4').style.display = "none";
  
  
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
    
    if(error1.localeCompare(message) == 0){
      document.getElementById('error1').style.display = "flex";
    } else {
      document.getElementById('error1').style.display = "none";
      console.log("Got new item, inserted with username: " + message);
      window.location.href = "https://dandelion-broad-cello.glitch.me/registerSuccess.html";
    }
    

  };

  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
});