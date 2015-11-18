/*
 * Lazy_Dialog.js
 * Start by @author QQ.Y on Date:2013-6-1
 * Update by @author QQ.Y on Data:2013-11-14
 */
zIndex = 1000;
Lazy_Dialog = Backbone.View
		.extend({
			/* ---------- Private properties ---------------- */

			options : {
				
				// 用户自定义的对话框内容的div层id号
				baseEl : null,
				
				// 对话框标题
				title : '',
				
				// 对话框显示的按钮集
				buttons : [ {
					id : 'ok',
					text : '确定'
				}, {
					id : 'cancel',
					text : '取消'
				} ],
				
				// 对话框的宽度、高度（不带单位）
				width : 300,
				
				height : 120,
				
				// 是否可关闭
				closable : true,
				
				// 是否显示背景蒙板
				modal : true,
				
				draggable : true,
				
				// 对话框的绝对定位，如果有位置的定义，则如下：position:{x:100,y:200}
				position : {
					x : 0,
					y : 0
				}
			},
			
			events : {
				"mousemove .cs2c_dialog_header" : "_mouseMoveDone",
				"mousedown .cs2c_dialog_header" : "_mouseDownDone",
				"click .cs2c_dialog_button div" : "_buttonAction",
				
				"click .cs2c_dialog_close_btn" : "closeDialog",
			},
			
			/* -------------- Private Methods ---------------------- */

			initialize : function() {
				
				// 随着浏览器窗体大小的改变渲染，包括样式和位置
				var thisEl = this;
				$(window).resize(function() {
					thisEl.render();
				});
				$(this.el).addClass('cs2c_dialog');
				
				// 在用户创建对话框内容位置创建对话框
				$(this.options.baseEl).parent().append(this.el);
				
				// 创建对话框内容
				this._createUidom();
				this._createHeader();
				this._createContent();
				this._createDialogShadow();
				this._createBottomButtons();
				this._isShadowMask(this.options.modal);
				this._createOtherComponent();
				
				this.closeDialog();
				
				_.bindAll(this, 'render');
				
			},
			
			render : function() {
				
				// 根据不同浏览器判断使用不同的尺寸
				var pageWidth = window.innerWidth, pageHeight = window.innerHeight;
				if (typeof pageWidth != 'number') {
					if (document.compatMode == 'CSS1Compat') {
						pageWidth = document.documentElement.clientWidth;
						pageHeight = document.documentElement.clientHeight;
					} else {
						pageWidth = document.body.clientWidth;
						pageHeight = document.body.clientHeight;
					}
				}
				
				var top, left;
				
				var thisEl = $(this.el)[0];
				thisEl.style.zIndex = zIndex++;
				// thisEl.style.display = "block";
				thisEl.style.position = "fixed";
				
				if (typeof this.options.position === 'undefined' || this.options.position.x === 0
						|| typeof this.options.position.x === 'undefined') {
					if (thisEl.clientHeight != this.options.height) {
						top = (pageHeight - thisEl.clientHeight) / 2 + "px";
					} else {
						top = (pageHeight - this.options.height) / 2 + "px";
					}
					left = (pageWidth - this.options.width) / 2 + "px";
				} else {
					top = this.options.position.y + "px";
					left = this.options.position.x + "px";
				}
				thisEl.style.top = top;
				thisEl.style.left = left;
				thisEl.style.minwidth = this.options.width + "px";
				thisEl.style.width = this.options.width + "px";
				// thisEl.style.height = (65 + this.options.height) + "px";
				thisEl.style.minHeight = this.options.height + "px";
				
				$(this.el).siblings('.cs2c_dialog_shadow').css({
					'filter' : 'alpha(opacity=30)',
					'width' : pageWidth + 'px',
					'height' : pageHeight + 'px'
				});
				return this;
				
			},
			
			/** 创建对话框四周边界的演示显示div区域 2013-8-9 */
			_createUidom : function() {
				var uiStr = '<div class="ui_left"></div><div class="ui_right"></div><div class="ui_top"></div><div class="ui_bottom"></div>';
				$(this.el).append(uiStr);
			},
			
			/** 创建对话框的标题 2012-10-19 */
			_createHeader : function() {
				
				// 创建标题栏
				$(this.el).append('<div class="cs2c_dialog_header"><span class="cs2c_dialog_header_icon"></span><span class="cs2c_dialog_header_title"></span></div>');
				
				// 将用户自定义的对话框标题写入新建对话框
				/*if(this.options.title_icon){
					$(this.el).find('.cs2c_dialog_header .cs2c_dialog_header_icon')
						.css("background-image","url(/common/lazy_panel/images/"+this.options.title_icon+".png)");
				}else{
					$(this.el).find('.cs2c_dialog_header .cs2c_dialog_header_icon')
					.css("background-image","url(../../static/css/images/icons/icon_edit.png)");
				}*/
				this.changeTitle(this.options.title);
				
				if (this.options.closable) {
					// 标题处工具栏
					var closedButton = document.createElement("a");
					closedButton.className = "cs2c_dialog_close_btn";
					//$(this.el).find('.cs2c_dialog_header').append(closedButton);
					// $(closedButton).html("关闭");
				}
				
			},
			
			/** 将用户定义的对话框内容层插入到绘制的对话框中 2012-10-19 */
			_createContent : function() {
				
				// 创建对话框的内容显示区域
				var dialog_body = document.createElement("div");
				dialog_body.className = "cs2c_dialog_body";
				dialog_body.style.position = "relative";
				// dialog_body.style.backgroundColor = "#fff";
				// dialog_body.style.height = (this.options.height - 35) +
				// "px";
				dialog_body.style.minHeight = (this.options.height - 65) + "px";
				dialog_body.style.overflowY = "auto";
				dialog_body.style.overflowX = "hidden";
				dialog_body.style.maxHeight = (this.options.height + document.documentElement.clientHeight) / 2 - 80
						+ "px";
				
				$(this.el).append(dialog_body);
				
				$(dialog_body).append($(this.options.baseEl));
				
			},
			
			/**
			 * 变换鼠标显示状态，移动 2012-12-5
			 * 
			 * @param e
			 */
			_mouseMoveDone : function(e) {
				
				if (!this.options.draggable) {
					return;
				}
				var header = e.currentTarget;
				header.style.cursor = "move";
			},
			
			/**
			 * 左键控制鼠标的移动 2012-12-5
			 * 
			 * @param e
			 */
			_mouseDownDone : function(e) {
				
				if (!this.options.draggable) {
					return;
				}
				
				e = e || event;
				var moveObj = $(e.currentTarget).parent();
				var moveObjOffset = moveObj.offset();
				
				// x=鼠标相对于网页的x坐标-网页被卷去的宽-待移动对象的左外边距
				var x = e.clientX - document.body.scrollLeft - moveObjOffset.left;
				// y=鼠标相对于网页的y左边-网页被卷去的高-待移动对象的左上边距
				var y = e.clientY - document.body.scrollTop - moveObjOffset.top;
				
				document.onmousemove = function(e) {// 鼠标移动
					if (!e) {
						e = window.event; // 移动时创建一个事件
					}
					moveObj.offset({
						left : e.clientX + document.body.scrollLeft - x,
						top : e.clientY + document.body.scrollTop - y
					});
				};
				document.onmouseup = function() {// 鼠标放开
					document.onmousemove = null;
					document.onmouseup = null;
					moveObj.css("cursor", "normal");
				};
			},
			
			/** 创建对话框背景蒙板层 2012-10-19 */
			_createDialogShadow : function() {
				var pageWidth = window.innerWidth, pageHeight = window.innerHeight;
				if (typeof pageWidth != 'number') {
					if (document.compatMode == 'CSS1Compat') {
						pageWidth = document.documentElement.clientWidth;
						pageHeight = document.documentElement.clientHeight;
					} else {
						pageWidth = document.body.clientWidth;
						pageHeight = document.body.clientHeight;
					}
				}
				var shadowStr = '<div class="cs2c_dialog_shadow" style="z-index:' + (zIndex++) + '; height:'
						+ pageHeight + 'px; width:' + pageWidth + 'px;"></div>';
				$(this.el).after(shadowStr);
			},
			
			/**
			 * 是否显示对话框的背景遮罩蒙板 2012-11-1
			 * 
			 * @param flag
			 */
			_isShadowMask : function(flag) {
				var outterMasks = $(this.el).siblings('.cs2c_dialog_shadow');
				if (outterMasks.length > 1) {
					_.each(outterMasks, _(function(outterMask) {
						var length = $(outterMask.previousSibling).find(this.options.baseEl).length;
						if (length !== 0) {
							outterMasks = $(outterMask);
						}
					}).bind(this));
				}
				if (flag) {
					outterMasks.show();
				} else {
					outterMasks.hide();
				}
			},
			
			/**
			 * 控制对话框的开关状态 2012-11-1
			 * 
			 * @param flag
			 */
			_isOpenDialog : function(flag) {
				$(this.el).css({
					zIndex : zIndex++
				});
				if (flag) {
					$(this.el).show();
					$(this.options.baseEl).show();
				} else {
					$(this.el).hide();
					$(this.options.baseEl).hide();
				}
			},
			
			/** 创建底部按钮集合层 2012-10-29 */
			_createBottomButtons : function() {
				
				if (this.options.buttons.length == 0) {
					return;
				}
				
				var dialog_btn = document.createElement("div");
				dialog_btn.className = "cs2c_dialog_button";
				
				$(this.el).append(dialog_btn);
				
/*				for ( var i = 0; i < this.options.buttons.length; i++) {
					var btn = document.createElement("a");
					btn.className = "l-btn ";
					btn.id = this.options.buttons[i].id;
					btn.href = "javascript:void(0)";
					// btn.textContent = this.options.buttons[i].text;
					
					$(dialog_btn).append(btn);
					$(btn).append('<span class="dialog-btn-left">' + this.options.buttons[i].text + '</span>');
				}*/
				
				for ( var i = 0; i < this.options.buttons.length; i++) {
					if(this.options.buttons[i].id!="ok" && this.options.buttons[i].id!="cancel"){
						$(dialog_btn).append("<div class='l_btn_ok'  id='"+this.options.buttons[i].id+"' >" + this.options.buttons[i].text + "</div");
					}
					else{
						
						$(dialog_btn).append("<div class='l_btn_"+this.options.buttons[i].id+"'  id='"+this.options.buttons[i].id+"' >" + this.options.buttons[i].text + "</div");
					}
				}
				
				
				////////////////临时添加代码   by peiqiong.yan
				if(this.options.buttons.length>2){
					$(this.el).find(".cs2c_dialog_button div:eq(0)").css("margin-left","33%");
					$(this.el).find(".cs2c_dialog_button div:gt(0)").css("margin-left","20px");
				}
				
				
				
			},
			
			/**
			 * 对话框按钮执行动作 2012-10-30
			 * 
			 * @param e
			 */
			_buttonAction : function(e) {
				var button = e.currentTarget.id;
				switch (button) {
				case "ok":
					this.okPressed();
					break;
				case "cancel":
					this.cancelPressed();
					break;
				default:
					this.otherPressed(button);
					break;
				}
			},
			
			/** 可自定义其他的控件 2012-12-21 */
			_createOtherComponent : function() {
				
			},
			
			/* -------------- Public Mehtods ----------------------- */

			/**
			 * 打开对话框 2012-10-29
			 * 
			 * @param x ,y
			 */
			openDialog : function(x, y) {
				
				this.options.position = {
					x : x,
					y : y
				};
				this._isOpenDialog(true);
				
				this._isShadowMask(this.options.modal);
				this._createOtherComponent();
				this.render();
				
				// 打开对话框即将鼠标焦点聚焦在第一个input输入框上
				var inputs = $(this.el).find('input');
				$.each(inputs, function(i, input) {
					if (i == 0 && $(input).css('display') != 'none') {
						$(input).focus();
					}
				});
				// 隐藏对话框中的tip提示小标签
				$('.validate_tip').hide();
			},
			
			/** 关闭对话框 2012-10-29 */
			closeDialog : function() {
				
				this._isOpenDialog(false);
				this._isShadowMask(false);
				// 隐藏对话框中的tip提示小标签
				$('.validate_tip').hide();
				$(".lazy_date_picker").hide();
			},
			
			/** 用户点击确定按钮执行动作 2012-11-1 */
			okPressed : function() {
			},
			
			/** 用户点击取消按钮执行动作 2012-11-1 */
			cancelPressed : function() {
				this.closeDialog();
			},
			
			/**
			 * 用户点击其他按钮执行动作，用户自定义可以重写 2012-11-1
			 * 
			 * @param btnClass
			 */
			otherPressed : function(btnClass) {
				
			},
			
			/**
			 * 重定义dialog的title 2014-05-14
			 * @author xiran.liu
			 */
			changeTitle : function(title){
				$(this.el).find('.cs2c_dialog_header span.cs2c_dialog_header_title').html(title);
			}
		
		});
/**
 * TODO 组建库的确认提示 by qianqian.yang 2013-4-18
 */
Lazy_Confirm = function(msg, fn,title,buttons) {
	
	var dialogIdDiv = document.createElement("div");
	dialogIdDiv.id = "lazy_confirm_dialog";
	$(dialogIdDiv).append("<span class='confirm_dialog_icon'></span><span class='confirm_dialog_message'></span>");
	$('body').append(dialogIdDiv);
	//$('body').append("<div id='lazy_confirm_dialog'><span class='confirm_dialog_icon'></span><span class='confirm_dialog_message'></span></div>");
	$("#lazy_confirm_dialog .confirm_dialog_message").html(msg);
	
	// 打开一个确认对胡框
	var confirm_dialog = new Lazy_Dialog({
		baseEl : "#lazy_confirm_dialog",
		title : title?title:"确认",
		width : 390,
		height : 140,
		closable : false,
		// 对话框显示的按钮集
		buttons : buttons?buttons:[ {
			id : 'ok',
			text : '确定'
		}, {
			id : 'cancel',
			text : '取消'
		} ],
		modal : true
	}).render();
	confirm_dialog.openDialog();
	
	// 销毁该确认对话框
	var destroyConfirm = function() {
		var dialog = $(dialogIdDiv).parent().parent();
		// 删除【确认对话框】的遮罩
		dialog.next().remove();
		// 删除【确认对话框】
		dialog.remove();
	};
	
	confirm_dialog.okPressed = function() {
		destroyConfirm();
		this.closeDialog();
		if (fn) {
			fn(true);
		}
	};
	confirm_dialog.cancelPressed = function() {
		destroyConfirm();
		this.closeDialog();
		if (fn) {
			fn(false);
		}
	};
};

Lazy_alert = function(msg,fn) {
	var dialogIdDiv = document.createElement("div");
	dialogIdDiv.id = "lazy_confirm_dialog";
	$(dialogIdDiv).append("<span class='confirm_dialog_icon'></span><span class='confirm_dialog_message'></span>");
	$('body').append(dialogIdDiv);
	$("#lazy_confirm_dialog .confirm_dialog_message").html(msg);
	
	// 打开一个确认对胡框
	var confirm_dialog = new Lazy_Dialog({
		baseEl : "#lazy_confirm_dialog",
		title : "确认",
		width : 390,
		height : 140,
		closable : false,
		modal : true,
		buttons : [ {
					id : 'ok',
					text : '确定'
				} ],
	}).render();
	confirm_dialog.openDialog();
	
	// 销毁该确认对话框
	var destroyConfirm = function() {
		var dialog = $(dialogIdDiv).parent().parent();
		// 删除【确认对话框】的遮罩
		dialog.next().remove();
		// 删除【确认对话框】
		dialog.remove();
	};
	
	confirm_dialog.okPressed = function() {
		destroyConfirm();
		
		this.closeDialog();
		
		if(!!fn){
			fn()
		};
	};
};
