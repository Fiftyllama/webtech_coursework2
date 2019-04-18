var express = require('express');
var router = express.Router();
var path = require('path');
var sqlite3 = require('sqlite3');
var dbPath = path.resolve(__dirname,'../test.db')
var db = new sqlite3.Database(dbPath);
var cookie= require('cookie');
var cookieSignature = require('cookie-signature');
var DateKey = cookieSignature.sign('server',String(ServerStartDate));
var ServerStartDate = new Date;
var bcrypt = require('bcrypt');


router.get('/', function(req, res){
res.render('encodeblock', {title: 'Pharao/Rot13 Encoder/Decoder',extra:""});
});

router.get("/login", function(req, res) {
  res.render('loginform', {title: 'login',extra:""});
});

router.get("/register", function(req,res){
  res.render('outside/registerform', {title: 'register',extra:""});
});

router.post("/login", function(req, res) {
  var usernames=req.body.username;
	var userpassword=req.body.password;
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

            if(bcrypt.compareSync(userpassword, result.Pwd))
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
          else
          {
            res.render('outside/loginform', {title : 'login failed', extra:"wrong username or password"});
          }

      })
    })
});

router.post('/register', function(req,res)
{

  var usernames=req.body.username;
	var userpassword=req.body.password;
  var passwordhash = bcrypt.hashSync(userpassword, 10);
  var usercookie = cookieSignature.sign('username', usernames) + '-' + DateKey;

	db.serialize(function(){
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
					db.run(`insert into User(UsrID,Pwd,cookie) values ('${usernames}','${passwordhash}','${usercookie}')`);
          db.run(`update User set cookie = '${usercookie}' where UsrID = '${usernames}'`);
          res.setHeader('Set-Cookie',cookie.serialize('UserInfo',usercookie,{maxAge:60*60*24}));
          res.redirect('/users');
				}
			})

	});
});






module.exports = router;
