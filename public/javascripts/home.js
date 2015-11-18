
var homeVar ={

};

homeVar.indexView ={
	init:function(){

		this.list_el="#userlist";
		

		this.render();	
	},

	/**
	*/
	render:function(){
		if($(this.list_el).parent().attr("class")!="lazy_datagrid"){
			this.createlist();
		}else{
			this.list.updateTable();
		}
	},

	createlist:function(){
		this.list = new Lazy_Table({
			url:"/home/list/",
			isFrontPagination:true,
			baseEl:this.list_el,
			clickable:true,
			parse:function(resp){
				return{
					list:resp.data
				}
			},
			onItemClick:function(model){

			},
			onCheckboxClick:_(function(models){

			}).bind(this),
			toolbar:[{
				id:"btn_add",
				text:"Add",
				handler:_(function(){
					homeVar.userAddView.init();
				}).bind(this)
			},{
				id:"btn_delete",
				text:"Delete",
				handler:_(function(){
					this.deleteItem();
				}).bind(this)
			}],
			showCheckbox:true,
			isMultiSelected:false,
			columns:[{
					title:"User Name",
					content:"name",
					formatter:function(value,rowData,rowIndex){
						return value;
					}
				},{
					title:"Password",
					content:"password",
					formatter:function(value,rowData,rowIndex){
						return value;
					}
				},{
					title:"Age",
					content:"age",
					formatter:function(value,rowData,rowIndex){
						return value;
					}
				},{
					title:"Description",
					content:"desc",
					formatter:function(value,rowData,rowIndex){
						return value;
					}
				},
			]

		});
	},


	deleteItem:function(){
		var item = this.list.getSelectedModels()[0];
		if(!!item){
			$.ajax({
				type:"post",
				url:"/home/delete/",
				data:item,

				success:function(resp){
					if(resp.action){
						alert(resp.data);
						homeVar.indexView.list.updateTable();
					}else{
						alert(resp.error);
					}
					//console.log(resp);
				}
			});
		}
		
	}
};


homeVar.userAddView = {
	init:function(){
		console.log("add init")
		this.el="#dialog_adduser"
		this.createComps();
		this.bindEvents();
		this.render();
	},

	createComps:function(){
		if($(this.el).parent().parent().attr("class")!="cs2c_dialog"){
			this.dialog = new Lazy_Dialog({
				baseEl : this.el,
				title:"Add User",
				width:500,
				height:250,
				closable:true,
				buttons:[{
					id:"ok",
					text:"Confirm"
				},{
					id:"cancel",
					text:"Cancel"
				}]
			}).render();
		}
	},

	bindEvents:function(){

	},

	render:function(){
		$(this.el).show();

		this.dialog.openDialog();
		this.dialog.okPressed = _(function(){
			$.ajax({
				type:"post",
				url:"/home/add/",
				data:{
					username:$(this.el).find("#username").val(),
					age:$(this.el).find("#age").val(),
					password:$(this.el).find("#password").val(),
					desc:$(this.el).find("#desc").val()
				},

				success:_(function(resp){
					if(resp.action){
						alert(resp.data);
						this.dialog.closeDialog();
						homeVar.indexView.list.updateTable();

					}else{
						alert(resp.error);
					}
					//console.log(resp);
				}).bind(this)
			});
		}).bind(this)
	}
};


window.onload=function(){
	//console.log("home loaded")
	homeVar.indexView.init();
}