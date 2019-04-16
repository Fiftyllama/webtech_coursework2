var express = require('express');
var router = express.Router();
var path = require('path');
var dbPath = path.resolve(__dirname,'../testing.db')
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbPath);
/* GET home page.
router.get('/', function(req, res, next) {
  res.sendFile("/views/index.html", { root: "." });
});
*/

router.get('/redirect', function(req, res){
  session = req.session;
  if (session.uniqueID) {
    console.log(session.uniqueID);
    res.end("welcome mr admin");
  } else{
    res.end("who are you???");
  }
});

router.get("/login", function(req, res) {
  res.sendFile("/views/loginForm.html", { root: "." });

});

router.post("/login", function(req, res) {
  //resp.end(JSON.stringify(req.body));
  session = req.session;
  if(req.body.username == "admin" && req.body.password == "admin") {
    session.uniqueID = req.body.username;
  }
  res.redirect('/redirect');
});

router.get("/test", function(req,res){
  res.render('encodeblock', {title: 'encoder',extra:""});

});


router.get("/register", function(req,res){
  res.render('loginForm', {title: 'register',extra:""});

});
router.post('/register', function(req,res)
{
	var usernames=req.body.username;
  console.log(usernames)
	var userpassword=req.body.password;
  console.log(userpassword);
  var usercookie = "null"
	db.serialize(function(){
		//'${usernames}'
		db.get(`select distinct * from User where UsrID = '${usernames}'`, function(err,result,row)
			{
				if(err)
				{
					throw err;
					console.log(result);
				}
				else if(result){
					res.render('registerr', { title: 'Signup Failed',extra:"username already in use"});
				}
				else
				{
					db.run(`insert into User(UsrID,Pwd,cookie) values ('${usernames}','${userpassword}','${usercookie}')`);
					res.render('index', { title: 'register Sucessful'});
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
