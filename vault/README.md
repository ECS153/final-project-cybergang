# Vault Application

Overall, our vault application focuses on a safe login and protected passwords. 
The application deals with error handling in the case of empty fields or any sort of 
way by which users can bypass a step. We register users and store them in a database 
that contains fields for the user, password, salt, authentication form and whether or not the
account is verified. Most of the contributions for the overall design and flow of html
of the application, including setting up the database itself was done by Julia. To differentiate
between email and phone verification, Luis and Steven worked on functions that would allow
either email or phone numbers to get stored into the database without having to add more columns.
Additionally, to protect our user's passwords they added salt and hashed the password with the salt. This was what 
was stored in the columns of the database. Steven worked on the email verifiaction portion
application and Luis worked on sms using Twilio. Both also worked on generating proper unique URL's.
Julia managed login flow upon sending a verification code. This means that that a user
had a place in the database upon signing up. However, if a verification was not entered or matched
the code that was sent, the user was locked out of being able to login. Overall, most of the
logic can be found in authScript.js, loginScript.js, script.js, and server.js. These files
serve as most of the backbone of the backend of our project.
