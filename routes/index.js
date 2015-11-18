var express = require('express');
var router = express.Router();
var UserInfo = require("../models/UserInfo");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  //next();
});

module.exports = router;
