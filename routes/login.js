var express = require('express');
var router = express.Router();
var dbuserlist = require('./../models/UserInfo');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
   res.render('login', { title: 'Login' });
}).post('/',function(req, res, next) {

	/*console.log("dogin ****************");
	var user={
		username:'admin',
		password:'admin'
	}

	console.log(req.body);
	if(req.body.username===user.username 
		&& req.body.password===user.password){
		//req.session.user = user;
		 //res.redirect("/home");
		//res.send({"action":true,"data":"OK"})
		res.render('home',{title:'Home'});
	}else{
		 res.redirect("/login");
	}*/

	var curName = req.body.username;
	var curPasswd = req.body.password;
	//console.log(router)
	//console.log(UserInfo)
	console.log("-------------------------------");
	dbuserlist.count({"name":curName,"password":curPasswd},function(err,resp){

		if(err){
			res.send(err);
		}else{
			if(resp>0){
				res.send({'action':true,'data':'login successful.'});
			}else{
				res.send({'action':false, 'data':'not existed user or wrong password.'});
			}

		}

		/*if(err || resp==0){
			//res.send(err);
			res.redirect("/login");
		}else{
			res.redirect("/home");
		}*/
	})

	
	
});

module.exports = router;
