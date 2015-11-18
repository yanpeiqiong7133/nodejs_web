// var mongodb = require('../config').db;
// var Schema = mongodb.mongoose.Schema;

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testdb');

//var db = mongoose.createConnection('mongodb://127.0.0.1:27017/testdb');

// db.on('error',function(error){
// 	if(error){
// 		console.log(error);
// 	}
	
// })

var UserInfoSchema = new mongoose.Schema({
	name:{type:String},
	desc:{type:String},
	password:{type:String},
	create_date:{type:Date, default:Date.now},
	age:{type:String}
});


var UserInfo = mongoose.model("userlist",UserInfoSchema);

/*var user = new UserInfo({"name":"user1","age":"99","password":"user1"});
	user.save(function(err){

	})*/
	UserInfo.count({},function(err,data){
	 	console.log(data);
	})
module.exports = UserInfo;
