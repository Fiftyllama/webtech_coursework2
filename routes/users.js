var express = require('express');
var router = express.Router();
var path = require('path');
var sqlite3 = require('sqlite3');
var dbPath = path.resolve(__dirname,'../test.db')
var db = new sqlite3.Database(dbPath);
var cookie= require('cookie');
var usrlist = []


router.get('/logout', function(req, res){ // logs the user out
res.clearCookie('UserInfo',{path:'/'}); //clears cookie
res.redirect('/'); //redirects to main page

});

router.get('/', function(req, res){
  try {var transit = req.cookies.UserInfo.split(" ") //splits the userpart out of the cookie
  var usercookie = transit[0]; //sets usercookie to the first entry in the list created
  var username = "";
  var messages = [];
  db.serialize(function(){
    db.get(`select distinct UsrID from User where cookie = '${usercookie}'`, function(err,result,row) //finds user by looking comparing cookie in db
    {
      if(result) //db query returned result
      {

        username = JSON.stringify(Object.values(result)) //:pukeemoji:
        username = username.replace(/\W/g, '')
        db.all(`select Sender, Recipient, MessageContent from Message where Recipient = '${username}' order by MessageID desc`, function(err,result,row)
        { // db looks up all messsages where the current user is in recipient field
          if(result) // db query returned result
          {
            var len = Object.keys(result).length; //checks the length of the result object
            for(var i = 0; i < len; i++){messages.push(Object.entries(result[i]));} // splits the result object into list
            usrlist = [];
            db.all(`select UsrID from User`, function(err,result){ //gets a new updated user list ready for rendering encodeblockinside at line 57

              var len = Object.keys(result).length;
              for(var i = 0; i < len; i++){
                  usrlist.push(Object.values(result[i]));
            }
            console.log(usrlist)
            res.render('inside/encodeblockinside', {userlist: usrlist, messages: messages});
            });
          }
        });
      }
      else
      {
          res.redirect('/');
      }
    });
  });
}
catch(error){
  res.redirect('/register')
}
});


router.post('/', function(req, res){
  var usr= "";
  var transit = req.cookies.UserInfo.split(" ")
  var usercookie = transit[0];
  var message = req.body.message;
  var recipient = req.body.dropDown;
  db.serialize(function(){
    db.get(`select distinct UsrID from User where cookie = '${usercookie}'`, function(err,result,row)
    {
      if(result)
      {
        usr = JSON.stringify(Object.values(result))
        usr = usr.replace(/\W/g, '');
        db.run(`insert into message(Sender,Recipient,MessageContent) values ('${usr}','${recipient}','${message}')`);
      }
  })
  });
res.redirect('/users');
});



module.exports = router;
