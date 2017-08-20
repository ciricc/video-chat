/* 
	*********************************************************
	*   Video live straming with chat                       *
	*   I am used nodeJs for char (socket.io -> WebSocket)  *
	*   And hls.js for live streaming HLS                   *
	*********************************************************

	Support: PC
	Auth: @ciricc
	Date-public: 20.08.2017
	License: MIT
	
*/

$(document).ready(function(){
	var messages = $('.messages.scrollbar-inner'),
		panel = $('.panel'),
		settings_app_toggler = $('.settings-app'),
		layouts = $('.layouts');


	messages.scrollbar();

	var socket = io(),
		IO_LISTENER = 
	{
		user_settings: {
			name: "",
			messages_scrolled: false
		},
		extends: {
			anti_auto_scroll: function () {
				messages.scroll(function(e){
					var max = messages[0].scrollHeight-messages.height();
					if (e.target.scrollTop < max) {
						IO_LISTENER.user_settings.messages_scrolled = true;
						console.log(true, e.target.scrollTop, max);
					} else {
						console.log(false);
						IO_LISTENER.user_settings.messages_scrolled = false;			
					}
				});
			},
			prepareModal: function (modal, callback) {
				$(modal).find('.modal-box').animate({
					width: "0px",
					height: "0px",
					overflow: "hidden",
					minWidth: "0%",
					marginTop: "30%"
				}, 'fast', function () {
					(callback) ? callback.call() : null;
				});
			},
			hideModal: function (modal) {
				if(modal===undefined){modal=$('.modal-wrapp').last();}
				IO_LISTENER.extends.prepareModal(modal, function(){
					$(modal).hide();
			  	});
			},
			showModal: function (p) {
				if(p === undefined) {p={}}
				var modal = $($('.modal.clone-modal-for-jquery').html());
				IO_LISTENER.extends.prepareModal(modal);

				$('body').append(modal);
  
				function afterPrepare(modal) {
					$(modal).show().find('.modal-box').animate({
						width: "auto",
						minWidth: "60%",
						height: "70%",
						overflow: "auto",
						marginTop: "20px"
					}, 'fast');
				}
  
			  	if (p.html) {
			    	$(modal).find('.content-wrapp').html(p.html);
			    	if (p.afterHTML) {p.afterHTML(modal);}
			    	if (p.title) {$(modal).find('.title-wrapp').html(p.title);}
			    	if (p.closer) {$(modal).find('.closer').html(p.closer);}
				    setTimeout(function(){ afterPrepare(modal);}, 50);
			  	}
			   	$(modal).find('.closer').click(function(){
			   		IO_LISTENER.extends.hideModal(modal);
				});
			}
		},
		sendMessage: function () {
			
			var msg = panel.find('.input').val().slice(0,160);
			panel.find('.input').val("");
			if (msg.replace(/\s/g, "").length != 0) {
				msg = (msg + " ").replace(/(\s){2,}/g, "").replace(/(http)?(s)?(\:\/\/)?([A-я0-9-]+)(\.?)([A-я0-9-]+)\.([A-я0-9]+)(\/.*?)?\s/g, "<a href='http$2://$4$5$6.$7$8' target='_blank'>$1$2$3$4$5$6.$7$8</a> ");

				socket.emit('chat send', {
					message: msg,
					name: IO_LISTENER.user_settings.name
				});
			}
		},
		online__init: function () {
			socket.on('join', function (online) {
				$('.online-c').html(online);
			});
			socket.on('out', function (online) {
				$('.online-c').html(online);
			});
		},
		online_chat__init: function () {
			
			panel.find('.input').keydown(function(e){
				if (e.keyCode == 13) {IO_LISTENER.sendMessage();}
			});

			panel.find('.send').click(function (e) {
				e.preventDefault();
				panel.find('.input').focus();
				IO_LISTENER.sendMessage();
			});

			socket.on('chat message', function (data) {
				var msg = "<li><div class='img'>"+((data.name)?(data.name[0].toLowerCase()):("?"))+"</div><span><b class='name-user'> "+data.name+" </b> " + data.message + "</span></li>";
				var scrolled = IO_LISTENER.user_settings.messages_scrolled;

				messages.find('ul').append(msg);
				if (!scrolled) {
					$('.down').fadeOut();
					messages.stop(true,false).animate({
						scrollTop: 99999999
					});
				} else {
					$('.down').fadeIn();
				}
			});
		},
		settings_app_toggler__init: function () {
			settings_app_toggler.click(function(){
				console.log(true);
				IO_LISTENER.extends.showModal({
					html: layouts.find('.settings-layout-modal').html(),
					closer: "Закрыть",
					title: "Настройки (до перезагрузки)",
					afterHTML: function (modal) {
						
						$(modal).find('.input-name').focus();

						if (IO_LISTENER.user_settings.name.length > 0) {
							$(modal).find('.input-name').val(IO_LISTENER.user_settings.name);
						}

						$(modal).find('.save-name').click(function(){
							IO_LISTENER.change_name(modal);
						});
						$(modal).find('.input-name').keydown(function(e){
							if (e.keyCode == 13) {IO_LISTENER.change_name(modal);}
						})
					}
				});
			});
			socket.on('name_change_result', function (answer) {
				if (answer.isValid == true) {
					$('.info').removeClass('error').addClass('success').html('Имя успешно изменено до перезагрузки страницы!');
					IO_LISTENER.user_settings.name = answer.name;
				} else {
					$('.info').removeClass('success').addClass('error').html('Это имя уже занято!');
				}
			});
		},
		change_name: function(modal){
			var name = $(modal).find(".input-name").val().replace(/([^A-zА-я\-\_0-9])/g, "");
			if (name.length > 0 && name.length <= 20) {
				socket.emit('check_name', {
					name: name,
					lastname: IO_LISTENER.user_settings.name
				});
			} else {
				if (name.length > 20) {
					$(modal).find('.info').removeClass('success').addClass('error').html('Слишком длинное имя! Максимум 20 символов!');
				} else {
					$(modal).find('.info').removeClass('success').addClass('error').html('Имя не может быть пустым!');
				}
			}
		},
		out_user__init__chat: function () {
			socket.on('outUser', function (userName) {
				var msg = $('<li><div class="notifer-center--chat"><b class="notif">'+userName+' ушел.</b></div></li>');
				messages.find('ul').append(msg);
			});
		},
		video_stream__init: function (url) {
			if(Hls.isSupported()) {
				var video = document.getElementById('video');
				var hls = new Hls();
				hls.loadSource(url);
				hls.attachMedia(video);
				$('.play-stream').fadeOut();
				
				$(video).css({
					marginTop: ($(video).height()/2)
				}).fadeIn();
				$('.video-controllers').find('.volumer').click(function(){
					if (video.volume == 0) {
						video.volume = 1;
						$(this).toggleClass('fa-volume-off').toggleClass('fa-volume-up')
					} else {
						video.volume = 0;
						$(this).toggleClass('fa-volume-off').toggleClass('fa-volume-up')
					}
				})
				hls.on(Hls.Events.MANIFEST_PARSED,function() {
					video.play();
				});
			}
		}
	}

	IO_LISTENER.online__init();
	IO_LISTENER.online_chat__init();
	IO_LISTENER.settings_app_toggler__init();
	IO_LISTENER.out_user__init__chat();

	//Anti auto scrolling messages after get message if user are scrolled the list of them
	IO_LISTENER.extends.anti_auto_scroll();
	IO_LISTENER.video_stream__init('https://live150.vkuserlive.com/639912/live/Kf103ixWmLY/playlist.m3u8');
});