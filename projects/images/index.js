var content = new Array();
content[2] = {comment:'comment',add:'Add a Comment',submit:'Submit',replay:'Reply',visitor:'visitor'};
content[0] = {comment:'评论',add:'添加评论',submit:'提交',replay:'回复',visitor:'游客'};
//添加评论
function addComment(busi_table,busi_id){
	var addUrl = $.rootPath+'/console/comment/addComments';
	$.post(addUrl,{busi_table:busi_table,busi_id:busi_id,review_info:$('#comment_info').val()},function(data){
		var json = $.parseJSON(data);
		if(json.success){
			window.location.href = window.location.href;
		}else{
			var flag = confirm(json.message);
			if(flag){
				$.post(addUrl+'?t='+new Date(),{busi_table:busi_table,busi_id:busi_id,review_info:$('#comment_info').val(),noLogin:'true'},function(data){
					var json = $.parseJSON(data);
					if(json.success){
						alert('评论成功！');
						window.location.href = window.location.href;
					}
				});
			}
		}
	});
}

//显示回复
function showReview(but,busi_table,busi_id,review_id,lang_type){
	var $com = $(but).parents('.comment');
	if($('#review_id').length > 0){
		$('#review_id').parents('.com-input').remove();
	}
	var html = $com.html()
	html += '<div class="com-input">'
				+'<div class="con">'
				+'	<div class="con-left"></div>'
				+'	<div class="con-center">'
				+'		<textarea class="con-in" id="review_id"></textarea>'
				+'	</div>'
				+'	<div class="con-right"></div>'
				+'</div>'
				+'<input type="button" class="sub-in" value="'
				+content[lang_type].submit
				+'" onclick="addReview(\''
				+busi_table+'\','+busi_id+','+review_id+')"/>'
				+'</div>';
	$com.html(html);
}

//保存回复信息
function addReview(busi_table,busi_id,review_id){
	var addUrl = $.rootPath+'/console/comment/addComments';
	$.post(addUrl,{busi_table:busi_table,busi_id:busi_id,review_info:$('#review_id').val(),review_id:review_id},function(data){
		var json = $.parseJSON(data);
		if(json.success){
			window.location.href = window.location.href;
		}else{
			var flag = confirm(json.message);
			if(flag){
				$.post(addUrl+'?t='+new Date(),{busi_table:busi_table,busi_id:busi_id,review_info:$('#review_id').val(),review_id:review_id,noLogin:'true'},function(data){
					var json = $.parseJSON(data);
					if(json.success){
						window.location.href = window.location.href;
					}
				});
			}
		}
	});
}

(function($){
	$.fn.comment = function(options){
		var ops = parseOptions($(this),options);
		$(this).ops = ops;
		var lang_type = ops.language_type
		if(!lang_type && lang_type != 0)lang_type =2;
		var getUrl = $.rootPath+'/console/comment/getAllComments?t='+new Date();
		var addUrl = $.rootPath+'/console/comment/addComments'+new Date();
		var $page = $(this);
		$page.addClass('com-page');
		var $cul = $('<div class="cul-comment">');
		//加载评论输入框的HTML
		var culHtml = '<div class="title">'
						+content[lang_type].comment
						+'</div>'
						+'<div class="edit">'
							+'<div class="edit-left"></div>'
							+'<div class="edit-center">'
								+'<div class="til">'+content[lang_type].add
							+'</div>'
							+'	<div style="float:left;width:100%;">'
							+'		<div class="edit-input-left"></div>'
							+'		<div class="edit-input-center">'
							+'			<textarea id="comment_info" style="width:558px;height:98px;border:0;"></textarea>'
							+'		</div>'
							+'		<div class="edit-input-right"></div>'
							+'		<div class="sub" style="width:132px;margin-left:18px;margin-top:35px;">'
							+'			<input type="button" value="'
							+content[lang_type].submit
							+'" style="margin-right:0;"'
							+' onclick="addComment(\''+ops.busi_table+'\','+ops.busi_id+');"/>'
							+'		</div>'
							+'	</div>'
							+'</div>'
							+'<div class="edit-right"></div>'
						+'</div>';
		$cul.html(culHtml);
		$cul.appendTo($page);
		var $con = $('<div class="com-con">');
		$con.appendTo($cul);
		//加载评论内容
		$.getJSON(getUrl,ops,function(json){
			if(!json){
				return;
			}
			for(var i=0;i<json.length;i++){
				var $comment = $('<div class="comment">');
				var com = json[i];
				//评论的内容
				var comment = com.review_info;
				//回复的按钮
				var replay = '	<div class="replay" onclick="showReview(this,\''
							+com.busi_table+'\','+com.busi_id+','+com.id+','+lang_type+');">'+content[lang_type].replay+'</div>';
				if(ops.auditing && ops.auditing == 1){
					if(com.auditing == 0){
						comment = '评论内容审核中';
						replay = '';
					}
					if(com.auditing == 2){
						continue;
					}
				}
				var comHtml = $comment.html();
				comHtml += '<div class="com-answer">'
								+'<div class="title">'
								+'	<span class="name">'+(com.member_yw_name != null?com.member_yw_name:(com.user_name!=null?com.user_name:content[lang_type].visitor))+'</span>'
								+'	<span class="time">'+com.review_date+'</span>';
				if(!com.review){
					comHtml +=replay;
				}
				comHtml +='</div>'
								+'<div class="con">'
								+comment
								+'</div>'
							+'</div>';
				if(com.review){
					var review = com.review;
					//回复的内容
					comment = review.review_info;
					if(ops.auditing && ops.auditing == 1){
						if(review.auditing == 0){
							comment = '回复内容审核中';
						}
						if(review.auditing == 2){
							continue;
						}
					}
					var reHtml = '<div class="com-replay">'
								+'<div class="title">'
								+'	<span class="name">'+(review.member_yw_name != null?review.member_yw_name:(review.user_name!=null?review.user_name:content[lang_type].visitor))+'</span>'
								+'	<span class="time">'+review.review_date+'</span>'
								+'</div>'
								+'<div class="con">'
								+comment
								+'</div>'
								+'</div>';
					comHtml +=reHtml;
				}
				$comment.html(comHtml);
				$comment.appendTo($con);
			}
		});
		
	}
	//解析参数
	function parseOptions(target, properties){
		var t = $(target);
		var options = {};
		
		var s = $.trim(t.attr('data-options'));
		if (s){
			if (s.substring(0, 1) != '{'){
				s = '{' + s + '}';
			}
			options = (new Function('return ' + s))();
		}
			
		if (properties){
			var opts = {};
			for(var i=0; i<properties.length; i++){
				var pp = properties[i];
				if (typeof pp == 'string'){
					if (pp == 'width' || pp == 'height' || pp == 'left' || pp == 'top'){
						opts[pp] = parseInt(target.style[pp]) || undefined;
					} else {
						opts[pp] = t.attr(pp);
					}
				} else {
					for(var name in pp){
						var type = pp[name];
						if (type == 'boolean'){
							opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
						} else if (type == 'number'){
							opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
						}
					}
				}
			}
			$.extend(options, opts);
		}
		return options;
	}
})(jQuery);
$(function(){
	$('.commentbox').comment();
	$('#iconBall').css('right',(1070-$('#iconBall').width())/2);
	
	$('#title a').each(function(index,element){
		if(index >= 5 && index<7){
			$(element).hover(function(){
				$('#hover').css('left',8+110*index);
				$('#hover').show();
			}, function(){
				$('#hover').hide();
			});
		}
		if(index == 2 || index == 3){
			$(element).hover(function(){
				$('#hover').css('left',110*index);
				$('#hover').show();
			}, function(){
				$('#hover').hide();
			});
		}
		if(index == 4){
			$(element).hover(function(){
				$('#hover').css('left',5+110*index);
				$('#hover').show();
			}, function(){
				$('#hover').hide();
			});
		}
		if(index < 2){
			$(element).hover(function(){
				$('#hover').css('left',-6+110*index);
				$('#hover').show();
			}, function(){
				$('#hover').hide();
			});
		}
	});
});


var _w = $(window).width();
var _h = $(window).height();

function autoLogin(event){
	var ev=event||window.event;
	if(ev.keyCode==13){
		ajaxLogin();
	}
}
//AJAX登陆
function ajaxLogin(userName,password){
	if(!userName){
		userName = $('#user_name').val();
	}
	if(!password){
		password = $('#password').val();
	}
	if(!userName){
		alert('用户名不能为空！');
		$('#user_name').focus();
		return;
	}
	if(!password){
		alert('密码不能为空！');
		$('#password').focus();
		return;
	}
	$.ajax({
	   type: "POST",
	   url:$.rootPath+'/console/ajaxLogin',
	   data: {username:userName,password:password},
	   dataType:"json",
	   success: function(data){
		  if(data.success){
			window.location.href = window.location.href;
		  }else{
			alert(data.message);
		  }
	   }
	});	
}

//AJAX登出
function ajaxLogout(){
	var url = $.rootPath+'/console/ajaxLogout';
	$.getJSON(url,{t:Math.random()},function(json){
		if(json.success){
			window.location.href = window.location.href;
		}else{
			alert(json.message);
		}
	});
}

//分页函数
function setPage(pageId,pageSize){
	if(pageId == 0){
		return ;
	}
	var url = window.location.href;
	if(url.indexOf('pageId=')<0){
		url+='&pageId='+pageId;
	}
	if(pageSize && url.indexOf('pageSize=')<0){
		url+='&pageSize='+pageSize;
	}
	var params = url.split('&');
	for(var i=1;i<params.length;i++){
		if(params[i].indexOf('pageId')==0){
			params[i] = 'pageId='+pageId;
		}
		if(params[i].indexOf('pageSize')==0){
			params[i] = 'pageSize='+pageSize;
		}
	}
	url=params.join('&');
	window.location.href=url;
}

//点击赞的操作
function zanFun(id){
	var count = $('#zan_count').html();
	count = parseInt(count.substr(1,count.length-1));
	count++;
	$.ajax($.rootPath+'/console/information/praise?id='+id,function(){
		
	});
	$('#zan_count').html('('+count+')');
}
//初始化修改密码
function initUpdatePwd(){
	$('#user_login').hide();
	$('#upd_pwd').show();
	$('#password1').focus();
}
//取消修改密码
function cancelPwd(){
	$('#user_login').show();
	$('#upd_pwd').hide();
}

//修改密码
function updatePwd(userId){
	var old=$.trim($('#password1').val());
	var new1=$.trim($('#password2').val());
	var new2=$.trim($('#password3').val());
	if(!old){
		alert('请输入原密码!');
		$('#password1').focus();
		return;
	}
	if(!new1){
		alert('请输入新密码!');
		$('#password2').focus();
		return;
	}
	if(!new2){
		alert('请输入确认密码!');
		$('#password3').focus();
		return;
	}
	if(new1!=new2){
		alert('您输入的新密码和确认密码不一样，请重新输入!');
		$('#password3').focus();
		return;
	}
	$.ajax({
	   type: "POST",
	   url:$.rootPath+'console/platuser/updatePassword',
	   data: {user_id:userId,old_pwd:old,new_pwd:new1},
	   dataType:"json",
	   success: function(data){
		  alert(data.message);
		  if(data.success){
			cancelPwd();
		  }
	   }
	});	
	
}

//切换语言信息
	function changeLanguage(type){
		/*var url = window.location.href;
		if($('#is_index').length > 0){
			var str = url.split('?');
			window.location.href = str[0]+'?l='+type;
			return;
		}
		if(url.indexOf('&lan_type=') <0 && url.indexOf('?lan_type') <0 && url.indexOf('?')>0){
			window.location.href+='&lan_type='+type;
			return;
		}else if(url.indexOf('?') < 0){
			window.location.href = url+'?lan_type='+type;
			return;
		}
		
		if(url.indexOf('&lan_type=')>0)url = url.substr(0,url.indexOf('&lan_type='))+'&lan_type='+type+url.substr(url.indexOf('&lan_type=')+11);
		if(url.indexOf('?lan_type=')>0)url = url.substr(0,url.indexOf('?lan_type='))+'?lan_type='+type+url.substr(url.indexOf('?lan_type=')+11);
		*/

		var url='/cn';
		if(type==2){
			url='/en';
		}
		window.location.href = url;
	}
	
	function openURL(defaultURL,vistURL){
		if(vistURL){
			window.open(vistURL)
		}else{
			window.open(defaultURL)
		}
		
	}