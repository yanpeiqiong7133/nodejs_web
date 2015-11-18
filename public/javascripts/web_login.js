console.log("login.js");
var loginView = {
	init:function(){
		this.bindEvents();
	},

	bindEvents:function(){
		$("#btn_login").bind("click",_(function(){
			console.log("btn_login clicked !!!");
			var user={};
			user.username=$("input[name='username']").val();
			user.password=$("input[name='password']").val();
			this.submit(user);

			console.log(user)
		}).bind(this))
	},

	submit:function(param){

		$.ajax({
			/*url : window.location.protocol + "//" + window.location.host
					+ "/web_users/api/web_users/",*/
			url	: "/login",
			type : "post",
			//dataType:"json",
			data : param,
			success : function(resp) {
				//window.innerHTML = resp;
				//window.write(resp);
				if(resp.action){
					location.href="/home";
				}else{
					location.href="/login"
				}
			}
		});
	}
};
window.onload = function(){
	console.log("loaded");
	loginView.init();
}
