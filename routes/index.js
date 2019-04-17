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
router.get('/', function(req, res){
res.render('encodeblock', {title: 'Pharao/Rot13 Encoder/Decoder',extra:""});
});

router.get('/redirect', function(req, res){
res.render('encodeblock', {title: 'encoder',extra:""});
});

router.get("/login", function(req, res) {
  res.render('loginform', {title: 'login',extra:""});

});

router.post("/login", function(req, res) {
  var usernames=req.body.username;
  console.log(usernames);
	var userpassword=req.body.password;
  console.log(userpassword);
  var usercookie = cookieSignature.sign('username', usernames) + '-' + DateKey;
db.serialize(function(){
  	db.get(`select distinct * from User where UsrID = '${usernames}'`, function(err,result,row)
    {
      if(err){
        throw err;
        console.log(result);
      }
          else if(result)
          {

            if (userpassword == result.Pwd)
              {
              db.run(`update User set cookie = '${usercookie}' where UsrID = '${usernames}'`);
              res.setHeader('Set-Cookie',cookie.serialize('UserInfo',usercookie,{maxAge:60*60*24}));
              res.redirect('/users');
              }
            else
            {
              res.render('outside/loginform', {title : 'login failed', extra:"wrong username or password"});
            }
          }

      })
    })
});

router.get("/test", function(req,res){

  var usrlist = []
  db.all(`select UsrID from User`, function(err,result){
    var len = Object.keys(result).length;
    for(var i = 0; i < 5; i++){
        usrlist.push(Object.values(result[i]));
  }
  res.render('inside/usersSelect', {userlist: usrlist});
  });


});


router.get("/register", function(req,res){
  res.render('outside/registerform', {title: 'register',extra:""});

});
router.post('/register', function(req,res)
{

  var usernames=req.body.username;
  console.log(usernames)
	var userpassword=req.body.password;
  console.log(userpassword);
  var usercookie = cookieSignature.sign('username', usernames) + '-' + DateKey;

	db.serialize(function(){
		//'${usernames}'
		db.get(`select distinct * from User where UsrID = '${usernames}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;

				}
				else if(result){
					res.render('outside/registerr', { title: 'Signup Failed',extra:"username already in use"});
				}
				else
				{
					db.run(`insert into User(UsrID,Pwd,cookie) values ('${usernames}','${userpassword}','${usercookie}')`);
          db.run(`update User set cookie = '${usercookie}' where UsrID = '${usernames}'`);
          res.setHeader('Set-Cookie',cookie.serialize('UserInfo',usercookie,{maxAge:60*60*24}));
          res.redirect('/users');
				}
			})

	});
});


/*

router.post("/register", function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var cookie = "null"
  db.get(`select distinct * from User where UsrID = '${username}'`), function(err,result,row){
    if(err)
        {
        throw err;
        console.log(result);
        }
    else if (result) {
      res.render("registerr");
      console.log("tomato");
    }
    else{
      console.log("tomato");
      db.run(`insert into User(UsrID,Pwd,cookie) values ('${usernames}', '${password}', '${cookie}')`);
      res.render('hurra');
    }
    }
})*/
module.exports = router;
