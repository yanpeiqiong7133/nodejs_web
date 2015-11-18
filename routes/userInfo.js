var express = require('express');
var router = express.Router();
var UserInfo = require('./../models/UserInfo.js');

//get userlist data
router.get('/', function(req, res, next) {
	res.send({"action":true,"data":[]})
  //res.send('respond with a resource');
  // res.render('login', { title: 'Login' });
}).post('/',function(req, res, next){
	//add userInfo
});

module.exports = router;