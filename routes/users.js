var express = require('express');
var router = express.Router();
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var dbPath = path.resolve(__dirname,'../testing.db')
var db = new sqlite3.Database(dbPath);
var cookie= require('cookie');
var cookieParser = require('cookie-parser');
var cookieSignature = require('cookie-signature');
var DateKey = cookieSignature.sign('server',String(ServerStartDate));
var ServerStartDate = new Date;
var usrlist = []
/* GET users listing.
router.get('/', function(req, res, next) {
    usrlist = [];
    db.all(`select UsrID from User`, function(err,result){

      var len = Object.keys(result).length;
      for(var i = 0; i < len; i++){
          usrlist.push(Object.values(result[i]));
    }
    console.log(usrlist)
    res.render('inside/encodeblockinside', {userlist: usrlist});
    });
});
*/

router.get('/', function(req, res){
  var transit = req.cookies.UserInfo.split(" ")
  var usercookie = transit[0];
  var username = "";
  var messages = [];
  db.serialize(function(){
    db.get(`select distinct UsrID from User where cookie = '${usercookie}'`, function(err,result,row)
    {
      if(result)
      {

        username = JSON.stringify(Object.values(result))
        username = username.replace(/\W/g, '')
        console.log(username);
        db.all(`select Sender, Recipient, MessageContent from Message where Recipient = '${username}' order by MessageID desc`, function(err,result,row)
        {
          if(result)
          {
            var len = Object.keys(result).length;
            for(var i = 0; i < len; i++){messages.push(Object.entries(result[i]));}
            console.log(messages[0]);
            console.log(result);
            usrlist = [];
            db.all(`select UsrID from User`, function(err,result){

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
});


router.post('/', function(req, res){
  var usr= "";
  var transit = req.cookies.UserInfo.split(" ")
  var usercookie = transit[0];
  var message = req.body.message;
  var recipient = req.body.dropDown;
  console.log(usercookie)
  console.log(message)
  console.log(recipient)
  db.serialize(function(){
    db.get(`select distinct UsrID from User where cookie = '${usercookie}'`, function(err,result,row)
    {
      if(result)
      {
        console.log(JSON.stringify(Object.values(result)))
        console.log("i was here!!!")
        usr = JSON.stringify(Object.values(result))
        usr = usr.replace(/\W/g, '');
    db.run(`insert into message(Sender,Recipient,MessageContent) values ('${usr}','${recipient}','${message}')`);
      }
  })
  });


});



module.exports = router;
