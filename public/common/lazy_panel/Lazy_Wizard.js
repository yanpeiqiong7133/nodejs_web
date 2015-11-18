/*
 * Lazy_Wizard.js
 * Start by @author QQ.Y on Date:2013-6-1
 * Update by @author QQ.Y on Data:2013-11-14
 */
Lazy_Wizard = Backbone.View
		.extend({
			
			// 使用的标志参数
			_pageNum : 1,
			
			options : {
				// 向导界面的位置
				baseEl : null,
				
				// 向导界面的高度
				height : 150,
				
				// 每一页是否显示完成按钮
				achievable : false,
				
				// 在上下步骤控制时，是否需要显示取消按钮
				cancelable : false,
				
				// 最后步骤，完成界面，是否显示上一步的按钮，（默认显示）
				okHasUp : true,
				
				// 是否需要导航显示条
				showBanner : true,
				
				// 向导步骤的显示名称
				steps : []
			
			},
			
			/* ------ Private Methods -------------- */

			render : function() {
				
				// 只显示第一屏的内容
				$(this.el).find('.cs2c_wizard_dialog_ctx').children().children().eq(0).show().siblings().hide();
				
				$(this.el).find('.cs2c_wizard_dialog_banner').children().eq(0).addClass('redText').siblings()
						.removeClass('redText');
				return this;
			},
			
			initialize : function() {
				
				// 页面选择定位初始化
				this._pageNum = 1;
				
				$(this.el).addClass('cs2c_wizard');
				
				// 在用户创建对话框内容位置创建对话框
				$(this.options.baseEl).parent().append(this.el);
				
				if (this.options.showBanner) {
					// 创建导航
					this._createWizardBanner();
				}
				// 创建内容
				this._createWizardCtx();
				// 创建按钮集合
				this._createWizardButton();
				
			},
			
			events : {
				"click .cs2c_dialog_button a" : "_buttonAction"
			},
			
			/** 创建向导进度步骤条 2013-11-11 */
			_createWizardBanner : function() {
				
				var bannerStepString = '';
				var lang = this.options.steps.length;
				var width_style = 'style="width:' + 100/lang + '%"';
				
				$(this.el).append('<div class="cs2c_wizard_dialog_banner"></div>');
				
				for ( var i = 0; i < lang; i++) {
					var redText = "";
					
					if(i===0){
						redText = "firstStep thisStep";
					}else if(i===(lang-1)){
						redText = "lastStep";
					}
					
					var banner_unit = $("<div " + width_style + " class='cs2c_wizard_dialog_banner_unit " + redText +"' ></div>");
					
					var banner_unit_text = "<div class='banner_unit_text'>" + this.options.steps[i] + "</div>";
					var banner_unit_index_container = $("<div class='banner_unit_index_container'></div>");
					
					var banner_unit_index_left = "<span class='banner_unit_index_left' style='width:50%'><span>";
					var banner_unit_index_center = "<span class='banner_unit_index_center'></span>";
					var banner_unit_index_right = "<span class='banner_unit_index_right' style='width:50%'></span>";
					
					banner_unit_index_container.append(banner_unit_index_left);
					banner_unit_index_container.append(banner_unit_index_right);
					banner_unit_index_container.append(banner_unit_index_center);
					
					
					banner_unit.append(banner_unit_text);
					banner_unit.append(banner_unit_index_container);
					
					$(this.el).find(".cs2c_wizard_dialog_banner").append(banner_unit);
					
//					$(this.el).find(".cs2c_wizard_dialog_banner").find(".banner_unit_index_left").css({"width":"50%"});
//					$(this.el).find(".cs2c_wizard_dialog_banner").find(".banner_unit_index_right").css({"width":"50%"});
					
					
				}
				//$(this.el).append('<div class="cs2c_wizard_dialog_banner">' + bannerStepString + '</div>');
				
			},
			
			/** 创建向导面板的内容 2013-11-11 */
			_createWizardCtx : function() {
				$(this.el).append('<div class="cs2c_wizard_dialog_ctx"></div>');
				$(this.el).find('.cs2c_wizard_dialog_ctx').append($(this.options.baseEl));
				$(this.el).find('.cs2c_wizard_dialog_ctx').height(this.options.height);
			},
			
			/** 创建向导面板的button区域 2013-11-11 */
			_createWizardButton : function() {
				$(this.el).append('<div class="cs2c_dialog_button"></div>');
				
				var dialog_btn = $(this.el).find('.cs2c_dialog_button');
				
				dialog_btn
						.prepend('<a class="l-btn cancel" href="javascript:void(0)"><span class="dialog-btn-left">取消</span></a>');
				dialog_btn
						.prepend('<a class="l-btn ok" href="javascript:void(0)"><span class="dialog-btn-left">完成</span></a>');
				
				if (dialog_btn.children().length <= 2) {
					dialog_btn
							.prepend('<a class="l-btn down" href="javascript:void(0)"><span class="dialog-btn-left">下一步</span></a>');
					dialog_btn
							.prepend('<a class="l-btn up" href="javascript:void(0)"><span class="dialog-btn-left">上一步</span></a>');
					
				} else {
					dialog_btn.find('.down').show();
				}
				
				dialog_btn.find('.up').hide();
				
				// 判断是否显示【完成】按钮
				this.options.achievable ? dialog_btn.find('.ok').show() : dialog_btn.find('.ok').hide();
				
				// 判断是否显示【取消】按钮
				this.options.cancelable ? dialog_btn.find('.cancel').show() : dialog_btn.find('.cancel').hide();
			},
			
			/**
			 * 控制向导面板的界面显示 2013-11-11
			 * 
			 * @param pageNum：从1开始
			 * 通过stepIndex指定显示哪一个向导
			 */
			_componentDisplayController : function(pageNum) {
				
				var dialog_btn = $(this.el).find('.cs2c_dialog_button');
				
				// 1、控制步骤进度条的显示
				var banners = $(this.el).find('.cs2c_wizard_dialog_banner').children();
				banners.eq(pageNum - 1).addClass('thisStep').siblings().removeClass('thisStep');
				
				if (pageNum !== 1) {
					banners.eq(pageNum - 2).addClass('prevText').siblings().removeClass('prevText');
				} else {
					$(this.el).find(".prevText").removeClass('prevText');
				}
				
				// 2、控制界面内容切换的显示
				$(this.options.baseEl).children().eq(pageNum - 1).show().siblings().hide();
				
				// 3.控制按钮的显示：如果是最后一页，显示完成和取消按钮
				var wizardNum = $(this.el).find(".cs2c_wizard_dialog_ctx").children().children().length;
				
				// 判断每一步的按钮显示状态
				if (pageNum === wizardNum) {
					
					// 最终的完成界面是否显示【上一步】按钮
					this.options.okHasUp ? dialog_btn.find('.up').show() : dialog_btn.find('.up').hide();
					
					dialog_btn.find('.down').hide();
					dialog_btn.find('.ok').show();
					
				} else if (pageNum === 1) {
					
					dialog_btn.find('.up').hide();
					dialog_btn.find('.down').show();
					
					// 判断是否显示【完成】按钮
					this.options.achievable ? dialog_btn.find('.ok').show() : dialog_btn.find('.ok').hide();
					
				} else {
					
					dialog_btn.find('.up').show();
					dialog_btn.find('.down').show();
					
					// 判断是否显示【完成】按钮
					this.options.achievable ? dialog_btn.find('.ok').show() : dialog_btn.find('.ok').hide();
				}
				
//				this.enterWizard(pageNum - 1);// 从0开始索引
			},
			
			/**
			 * 上下步、完成等的按钮的执行动作 2013-11-11
			 * 
			 * @param e：鼠标点击事件
			 */
			_buttonAction : function(e) {
				
				var btnClass = e.currentTarget.className.split(" ")[1];
				
				switch (btnClass) {
				case 'up':
					this.prevPressed(this._pageNum - 1);
					this._pageNum--;
					break;
				case 'down':
					if (!this.nextPressed(this._pageNum - 1)) {
						return;
					}
					this._pageNum++;
					break;
				case 'cancel':
					this.cancelPressed();
					break;
				case 'ok':
					this.okPressed(this._pageNum - 1);
					return;
					break;
				default:
					break;
				}
				
				this._componentDisplayController(this._pageNum);
				
			},
			
			/* ------ Public Methods -------------- */

			/**
			 * 上一步按钮执行动作 2013-11-11
			 * 
			 * @param pageNum： 从0开始索引
			 */
			prevPressed : function(pageNum) {
			},
			
			/**
			 * 下一步按钮执行动作 2013-11-11
			 * 
			 * @returns {Boolean}
			 * @param pageNum
			 */
			nextPressed : function(pageNum) {
				return true;
			},
			
			/**
			 * 完成按钮执行操作 2013-11-11
			 * 
			 * @param pageNum
			 */
			okPressed : function(pageNum) {
			},
			
			/** 取消按钮执行操作 2013-11-11 */
			cancelPressed : function() {
			},
			
			/**
			 * 显示向导需要显示第几步 2013-11-11
			 * 
			 * @param index：从0开始索引
			 */
			showWizardStep : function(index) {
				
				this._pageNum = index + 1;
				this._componentDisplayController(index + 1);
			},
			
			/**
			 * 隐藏向导的部分步骤（包括进度指示条以及内容） 2013-11-11
			 * 
			 * @param index：从0开始检索
			 */
			hideWizardStep : function(index) {
				
				// 1、控制步骤进度条的显示
				var banners = $(this.el).find('.cs2c_wizard_dialog_banner').children();
				banners.eq(index).hide();
				// 2、控制界面内容切换的显示
				$(this.options.baseEl).children().eq(index).hide();
			},
			
			enerWizard : function(pageNum) {
				
			}
		
		});
