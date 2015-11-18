var express = require('express');
var router = express.Router();
var dbuserlist = require('./../models/UserInfo');

/* GET users listing. */

//get home page
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
   res.render('home', { title: 'Home' });
});

//add a new user
router.post('/add/',function(req,res,next){
	var obj={
		'name':req.body.username,
		'password':req.body.password,
		'age':req.body.age,
		'desc':req.body.desc
	};

	 var instance = new dbuserlist(obj);
	 instance.save(function(err){
	 	if(!!err){
	 		res.send({action:false,error:err});
	 	}else{
	 		res.send({action:true,data:'add success!'});
	 	}
	 })
});

//get user list 
router.get('/list/',function(req, res, next){
	dbuserlist.find(function(err,resp){
		if(!!err){
			res.send({action:false,error:err});
		}else{
			res.send({action:true,data:resp});
		}
	})
});

router.post('/delete/',function(req, res, next){
	dbuserlist.remove(req.body,function(err){
		if(!!err){
			res.send({action:false,error:err});
		}else{
			res.send({action:true,data:"delete success!"});
		}
	})
})


module.exports = router;
