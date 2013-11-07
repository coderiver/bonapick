var BONAPICK = BONAPICK || {};

/**
 * BONAPICK - bonapick.com namespace and functionality
 *
 * @package Bonapick
 * @author Oleksandr Kryshchenko <okryshchenko@gmail.com>
 */
BONAPICK = function(bonapick, $){
	var _self = bonapick;
	var _initialized = false;
	
	/**
	 * Checks for a configuration option
	 */
	_self.getConfig = function(option){
		if (typeof(_self.config) == 'undefined' || typeof(_self.config[option]) == 'undefined'){
			return null;
		}

		return _self.config[option];
	};
	
	/**
	 * Public init - initialize the javascript object
	 */
	_self.init = function(){
		_self.carousel_stopped = false;

		// Fb like javascript
		(function(d, s, id){
			var js, fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=493526987352966";
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));

		// slider
		if ($('#carousel_slides').length > 0){
			_self.carousel = $('#carousel_slides').bxSlider({
				mode: 'fade',
				controls: false,
				auto: true,
				autoHover: true
			});
	
			// lets handle hover event for the search and title of the carousel
			$('.title_and_search').hover(function(){
				_self.carousel.stopAuto();
				_self.carousel_stopped = true;
			}, function(){
				_self.carousel.startAuto();
				_self.carousel_stopped = false;
			});	
		}

		$('#menu .black_btn').bind('click', function(){
			$('#menu .login_menu').toggle();
			return false;
		});

		// lets add data-top to all anchors
		$('.nav_anchor').each(function(){
			if (!$(this).attr('data-top')){
				var offset = $(this).offset();
				$(this).attr('data-top', offset.top);
			}
		});

		// Hide UP button if user on first screen
		if ($(this).scrollTop()>=$(window).height()){
			$('.up_link').show();
		} else {
			$('.up_link').hide();
		}

		// lets make navbar stick on height offset
		$(document).scroll(function(){
			// sticky panel
			// If has not activated (has no attribute "data-top")
			if ($('nav').length && !$('nav').attr('data-top')){
				// Remember top position
				var offset = $('nav').offset()
				$('nav').attr('data-top', offset.top);
			}
			if ($('nav').attr('data-top') - 50 <= $(this).scrollTop()){
				$('.content').addClass('overmargin');
				$('nav').addClass('fixed');
			} else {
				$('nav').removeClass('fixed');
				$('.content').removeClass('overmargin');
			}
			// Hide UP button if user on first screen
			if ($(this).scrollTop()>=$(window).height()){
				$('.up_link').show();
			} else {
				$('.up_link').hide();
			}
			// nav menues
			$('.nav_anchor').each(function(){
				if ($(this).attr('data-top') - 110 <= $(document).scrollTop()){
					var menu_name = $(this).attr('name');
					$('#nav_menu a').each(function(){
						// lets disable all first
						$(this).removeClass('active');
						if ($(this).attr('href').indexOf(menu_name) !== -1){
							$(this).addClass('active');
						}
					});
				}
			});
		});
		
		// if menu link is clicked
		$('#nav_menu a').click(function(){
			var menu_name = $(this).attr('href').substring(1);
			// lets find the anchors position
			var anchor_position = $('.nav_anchor[name="' + menu_name + '"]').attr('data-top');

			$('html, body').animate({
				scrollTop: (anchor_position - 110)
			}, 100);
			//return false;	
		});
		
		// scroll to the top of the page
		$('.up_link').click(function(){
			$('html, body').animate({scrollTop:0}, 100);
			return false;
		});

        // add sign in handler
        $("#sign_in_btn").click(function(){
            $("#login_form").submit();
            return false;
        });

        // add search handler to unauthenticated home page
        $("#home_search_btn").click(function(){
           $("#search_form").submit();
        });

        //account buttons handlers. this is the only place handlers work.
        $("#profile_pic").change(function(){
            $("#account-form").submit();
        });

        $("#pic_delete_btn").click(function(){
            $("#delete_pic").val("1");
            $("#account-form").submit();
        });

        $("#save_btn").click(function(){
            $("#account-form").submit();
        });
        //end account buttons

        // show users menu in the top bar
		$("#user_menu").click(function(e){
			$(this).toggleClass('on');
			$('.user_menu').toggle();
			// prevent event bubbling
			e.stopPropagation();
			return false;
		});

		// show the tooltip
		$('.help').click(function(e){
			$(this).find('.tooltip').toggle();
			// prevent event bubbling
			e.stopPropagation();
			return false;
		});

		// lets show percentage pie charts
		_self.showPieChart('.feed .item .percentage');

		_self.preparePick();

		// lets add a users question for the new request creation
		(function(){
			var question_input = $('.addrequest .question_wrapper').find('input');
			var question_p = $('.addrequest .question_wrapper .gray').find('p');
			var text = question_input.attr('value');
			var question_select = $('.addrequest .question_wrapper').find('select');
			var question_select_p =	$('.addrequest .question_wrapper .blue').find('p');
			var select_text = $('option:selected', question_select).text();

			if (text != ''){
				question_p.html('<b class="pencil"></b>' + text);
			} else {
				question_p.html('<b class="pencil"></b>Type your question here');
			}
			question_select_p.html('<b class="pencil_white"></b>' + select_text);

			question_p.bind('click', function(){
				$(this).hide();
				question_input.show().focus();
			});
			question_input.focusout(function(){
				var input_value = $('.addrequest .question_wrapper').find('input').val();
				if (input_value != ''){
					question_p.html('<b class="pencil"></b>' + input_value);
					question_input.hide();
					question_p.show();
				} else {
					question_input.hide();
					question_p.html('<b class="pencil"></b>Type your question here').show();
				}
			});

			question_select.change(function(){
				question_select_p.html('<b class="pencil_white"></b>' + $('option:selected', this).text());	
			});
		})();

		// lets add a users comment for his vote
		(function(){
			var comment_input = $('.comment_wrapper').find('input');
			var comment_p = $('.comment_wrapper .gray').find('p');
			comment_input.each(function(index){
				var text = $(this).attr('value');
				var comment_p_local = $(this).parent().find('p');

				if (text != ''){
					comment_p_local.html('<b class="pencil"></b>' + text);
				} else {
					comment_p_local.html('<b class="pencil"></b>Leave a small comment for your vote');
				}
			});

			comment_p.bind('click', function(){
				var comment_input_local = $(this).parent().find('input');
				$(this).hide();
				comment_input_local.show().focus();
			});
			comment_input.bind('focusout', function(){
				var input_value = $(this).val();
				var comment_p_local = $(this).parent().find('p');
				if (input_value != ''){
					comment_p_local.html('<b class="pencil"></b>' + input_value);
					$(this).hide();
					comment_p_local.show();
				} else {
					$(this).hide();
					comment_p_local.html('<b class="pencil"></b>Leave a small comment for your vote').show();
				}
			});
		})();

		// lets load social sharing popup
		$('.invite-friends').bpPopup({
			width: 500,
			before_callback: function(btn){
				var json_string = $(btn).attr('data-json');
				_self.socialPopup(json_string, btn);
			},
			opacity: 0.5
		});

		// lets load single item popup
		$('.popular_feed a.image_small').bpPopup({
			before_callback: function(btn){
				var json_string = $(btn).attr('data-json');
				_self.populatePopup(json_string, btn);
			},
			opacity: 0.5
		});

		$('.popular_feed .image_big').bpPopup({
			before_callback: function(btn){
				var json_string = $(btn).attr('data-json');
				_self.populatePopup(json_string, btn);
			},
			opacity: 0.5
		});

		$('.feed .feed_item .item_image').bpPopup({
			before_callback: function(btn){
				var json_string = $(btn).attr('data-json');
				_self.populatePopup(json_string, btn);
			},
			opacity: 0.5
		});

        $('.item .zoom').bpPopup({
            before_callback:function(btn){
                var json_string = $(btn).attr('data-json');
                _self.populatePopup(json_string, btn);
            },
            opacity:0.5
        })

		// Show popup when clicking on title
		$('.feed .feed_item .item_meta').find('p').bind('click', function(e){
			$(this).parent().parent().parent().find('.item_image').click();
			// prevent event bubbling
			e.stopPropagation();
			return false;
		});
		// Show popup when clicking on percentage
		$('.feed .feed_item .item_meta').find('div').bind('click', function(e){
			$(this).parent().parent().parent().find('.item_image').click();
			// prevent event bubbling
			e.stopPropagation();
			return false;
		});

		window.addEventListener('orientationchange', function(){
			_self.onOrientationChange();
		});

		// lets see in what orientation the mobile screen is
		_self.onOrientationChange();

		// lets remove item from the picked list // for now will use just regular form submit
		/*$('.addrequest .picked .item .close').click(function(){
			$(this).parent().parent().remove();
			return false;
		});*/

		$('.disabled').bind('click', function(){
			return false;
		});

		// scroll nicely to the hash anchor
		if (window.location.hash){
			var anchor_name = window.location.hash.substring(1);;
			var anchor_position = $('.nav_anchor[name="' + anchor_name + '"]').attr('data-top');
			$('html, body').animate({
				scrollTop: (anchor_position - 110)
			}, 100);
		}

		// lets initiate our timers
		$('.timer').each(function(){
			var json_string = $(this).attr('data-json');
			var json_object = JSON.parse(json_string);
			_self.countDownTimer($(this), json_object.delta);
		});

		if ($(window).width() <= 759){
			// lets change a placeholder text in the search field
			$('#search_box').attr('placeholder', 'Looking for ...');
			$('#home_search_box').attr('placeholder', 'Looking for ...');
		}

		$(document).on('click', '.share_icon', function(e){
			if ($(this).hasClass('active')){
				$(this).removeClass('active');
				$(this).parent().find('ul').hide();
			} else {
				// lets hide all first
				$('.share_icon').removeClass('active');
				$('.share_icon').parent().find('ul').hide();
				$(this).parent().find('ul').toggle();
				$(this).toggleClass('active');
			}
			// prevent event bubbling
			e.stopPropagation();
			return false;
		});

		// initialize Zero Clipboard
		ZeroClipboard.setDefaults({moviePath: window.location.protocol + '//' + window.location.host + '/static/swf/ZeroClipboard.swf', forceHandCursor: true});
		$('.sharelink_icon').each(function(){
			var clip = new ZeroClipboard($(this));
			clip.on('dataRequested', function(client, args){
				client.setText($(this).attr('href'));
			});
			clip.on('complete', function(client, args){
				//alert("Copied text to clipboard: " + args.text);
				$('.page-message-wrapper .page-message-text').text('Link URL has been copied to clipboard.');
				$('.page-message-wrapper').slideDown(1000, function(){
					setTimeout(function(){
					   $('.page-message-wrapper').slideUp(1000, function(){});
					},3000);
				});
			});
		});

		// click the facebook share icon
		$(document).on('click', '.social_sharing_icons .facebook_icon', function(){
			var url = $(this).attr('href');
			var fbDialog = window.open(url, '', 'width=600,height=400');
			fbDialog.focus();
			return false;
		});

		// click the twitter share icon
		$(document).on('click', '.social_sharing_icons .twittershare_icon', function(){
			var url = $(this).attr('href');
			var twDialog = window.open(url, '', 'width=600,height=400');
			twDialog.focus();
			return false;
		});

		// click the twitter share icon
		$(document).on('click', '.social_sharing_icons .googleplus_icon', function(){
			var url = $(this).attr('href');
			var gpDialog = window.open(url, '', 'width=600,height=400');
			gpDialog.focus();
			return false;
		});

		// click the pinterest share icon
		$(document).on('click', '.social_sharing_icons .pinterest_icon', function(){
			// this is hack to prevent pinterest javascript from picking
			// up our statik link button
			var root_url = 'http://pinterest.com/pin/create/button/';
			var url = root_url + $(this).attr('href');
			var pnDialog = window.open(url, '', 'width=600,height=400');
			pnDialog.focus();
			return false;
		});

		/* ## Google Analytics events ## */
		$('.ga_event_handler').click(function(){
			var json_string = $(this).attr('data-event');
			var json_object = JSON.parse(json_string);
			var action = 'click';
			if (typeof(ga) !== 'undefined'){
				ga('send', 'event', json_object.category, action, json_object.label, json_object.value);
			}
		});
		$('.ga_event_handler').mouseenter(function(){
			var json_string = $(this).attr('data-event');
			var json_object = JSON.parse(json_string);
			var action = 'hover';
			if (typeof(ga) !== 'undefined'){
				ga('send', 'event', json_object.category, action, json_object.label, json_object.value);
			}
		});

		// trigger initialize event
		_initialized = true;
		$(this).trigger('initialized');
	};

	// prepare object of the Pick buttons in the feed
	_self.preparePick = function(){
		// lets show and hide picked item checkmark (invited feed)
		$('.feed .request').each(function(){
			$('.item .item_meta label', this).bind('click', function(e){
				// lets hide all checkmarks and make all butons green first
				$(this).parent().parent().parent().parent().find('.checkmark_wrapper').hide();
				$(this).parent().parent().parent().parent().find('label .button_grey').removeClass('disabled button_grey').addClass('button_green ga_event_handler');
				$(this).parent().parent().parent().parent().find('input[type=radio]').prop("checked", false);
				// now lets show the checkmark and make button gray and disabled
				$(this).parent().parent().find('.item_image .checkmark_wrapper').show();
				$(this).find('.button_green').addClass('disabled button_grey').removeClass('button_green ga_event_handler');
				//now lets check the radio button
				$(this).find('input[type=radio]').prop("checked", true);
				// now lets update confirm button text
				var picks_selected = $('input[type=radio]:checked').size();
				var btn_text = $('.confirm-pick').val();
				if(picks_selected == 1 ){
					var that = this;
					if (btn_text.substring(0,5) != "Login") {
						$('.confirm-pick').html('Cast Your Vote');
					} else {
						var tooltipElem = $(that).closest('.feed_item_status_wrapper').next().find('.tooltip');
						if (tooltipElem.length) {
							tooltipElem.show();
						} else {
							var tooltip = '		<div class="tooltip confirm blue" style="display:block;">';
							tooltip +='			<p>';
							tooltip +='								Click here to cast your vote, see the results and be able to earn some money.			';
							tooltip +='			</p>';
							tooltip +='		</div>';
							tooltip +='';
							$(that).closest('.feed_item_status_wrapper').next().find('.confirm-pick').after(tooltip);
						}
					}
					$(this).closest('.feed_item').find('.confirm-pick').addClass('attention button_blue');
					$('html, body').animate({
						scrollTop: $(that).closest('.feed_item').find('.confirm-pick').offset().top-Math.round(0.8*$(window).height())
					}, 500, function() {});
				}
				else if (picks_selected > 1){
					var that = this;
					$('.confirm-pick').html('Cast Your ' + picks_selected + ' Votes');
					$(this).closest('.feed_item').find('.confirm-pick').addClass('attention button_blue');
					$('html, body').animate({
						scrollTop: $(that).closest('.feed_item').find('.confirm-pick').offset().top-Math.round(0.8*$(window).height())
					}, 500, function() {});
				} else {
					$('.confirm-pick').removeClass('attention button_blue');
				}
				return false;
			});
		});
	};

	// shows pie chart
	_self.showPieChart = function(selector){
		$(selector).each(function(){
			var json_string = $(this).attr('data-json');
			var json_object = JSON.parse(json_string);
			var color_string = '#3bb6e8';
			if (json_object.winner==true) {
				color_string = '#49ac60';
			}
			var data = [
				{data: parseInt(json_object.percentage), color: color_string},
				{data: (100 - parseInt(json_object.percentage)), color: '#FFF'}
			];

			$.plot($('.pie', this), data, {
				series: {
					pie: {
						show: true,
						stroke: {
						    width: 0
						},
						startAngle:parseFloat(json_object.start_angle),
						label: {
							show: false
						}
					}
				},
				legend: {
					show: false
				}
			});
		});
	};

    function getScrollBarWidth () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild (inner);

        document.body.appendChild (outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 == w2) w2 = outer.clientWidth;

        document.body.removeChild (outer);

        return (w1 - w2);
    };


	// populates social sharint popup whith icons
	_self.socialPopup = function(json_string, btn){
		var json_object = JSON.parse(json_string);
		$('#popup #popup_content').empty();
		var social_btns = $(".social_sharing_icons").find("ul");
		var content = '<div class="social_sharing_popup">'+
		'<h2 class="title">Invite friends to vote</h2><ul>' + 
		social_btns.html() + "</ul>"+
		"<p>Share this voting to let your friends help you with </br> choosing the best</p>"+
		"</div>";
		$('#popup #popup_content').append(content);

		// initialize Zero Clipboard
		ZeroClipboard.setDefaults({moviePath: window.location.protocol + '//' + window.location.host + '/static/swf/ZeroClipboard.swf', forceHandCursor: true});
		$('.social_sharing_popup .sharelink_icon').each(function(){
			var clip = new ZeroClipboard($(this));
			clip.on('dataRequested', function(client, args){
				client.setText($(this).attr('href'));
			});
			clip.on('complete', function(client, args){
				//alert("Copied text to clipboard: " + args.text);
				$('.page-message-wrapper .page-message-text').text('Link URL has been copied to clipboard.');
				$('.page-message-wrapper').slideDown(1000, function(){
					setTimeout(function(){
					   $('.page-message-wrapper').slideUp(1000, function(){});
					},3000);
				});
			});
		});

		// click the facebook share icon
		$('.social_sharing_popup .facebook_icon').click(function(){
			var url = $(this).attr('href');
			var fbDialog = window.open(url, '', 'width=600,height=400');
			fbDialog.focus();
			return false;
		});

		// click the twitter share icon
		$('.social_sharing_popup .twittershare_icon').click(function(){
			var url = $(this).attr('href');
			var twDialog = window.open(url, '', 'width=600,height=400');
			twDialog.focus();
			return false;
		});

		// click the twitter share icon
		$('.social_sharing_popup .googleplus_icon').click(function(){
			var url = $(this).attr('href');
			var gpDialog = window.open(url, '', 'width=600,height=400');
			gpDialog.focus();
			return false;
		});

		// click the pinterest share icon
		$('.social_sharing_popup .pinterest_icon').click(function(){
			// this is hack to prevent pinterest javascript from picking
			// up our statik link button
			var root_url = 'http://pinterest.com/pin/create/button/';
			var url = root_url + $(this).attr('href');
			var pnDialog = window.open(url, '', 'width=600,height=400');
			pnDialog.focus();
			return false;
		});

		$('#popup #popup_content').show();
	};

	// populates item popup when image is clicked
	_self.populatePopup = function(json_string, btn){
		var json_object = JSON.parse(json_string);
		var domain_name = window.location.protocol + '//' + window.location.host;
		var encoded_title =  $('<div/>').text(json_object.title).html().replace(/\"/g,'\\x22').replace(/\'/g,'\\\'');
		var windowWidth = document.documentElement.clientWidth;
		var scrollBarWidth = getScrollBarWidth();
		windowWidth = scrollBarWidth + windowWidth;
		var img_url = windowWidth > 320? json_object.big_img_url:json_object.img_url;
		var buy_btn_class = '';
		var buy_btn_text = '';
		if ( json_object.merchant == 1 ){
			buy_btn_class = 'amazon_btn';
			buy_btn_text = 'Buy at Amazon';
		} else if ( json_object.merchant == 2){
			buy_btn_class = 'ebay_btn';
			buy_btn_text = 'Buy at Ebay';
        } else if (json_object.merchant == 3){
            buy_btn_class = 'fancy_btn';
            buy_btn_text = 'Buy at Fancy';
        }

        var buy_price_text = 'at the best price';
        if (json_object.price){
            buy_price_text = 'for $' + json_object.price
            if(json_object.shipping){
                if (json_object.shipping.type == "Flat"){
                    buy_price_text = buy_price_text + ' and $' + json_object.shipping.price + ' flat rate shipping';
                }else if(json_object.shipping.type == "Free"){
                    buy_price_text = buy_price_text + ' with FREE shipping'
                }
                else{
                    buy_price_text = buy_price_text + ' (see site for shipping details)'
                }
            }else{
                buy_price_text = buy_price_text + ' (see site for shipping details)'
            }
        }

		$('#popup #popup_content').empty();

		if (json_object.request_status == 'voted'){
			// invited feed status 'VOTED'
			var template = '' +
				'<div class="column1">' +
					'<div class="img" style="background-image:url(\'' + img_url + '\');"></div>' +
				'</div>' +
				'<div class="column2">' +
					'<h2>' + json_object.title + '</h2>' +
					'<div class="vote_info" data-json=\'{"percentage":"' + json_object.percentage + '","start_angle":"' + json_object.start_angle + '","winner":"' + json_object.winner + '"}\'>' +
						'<div class="pie"></div><span>' + json_object.percentage + '%</span>' +
						'<p class="right">of people think this one is better than the rest</p>' +
					'</div>' +
					'<a href="#" class="green_btn_small" onclick="add_to_pick(\''+ encoded_title +'\')"><span>Add to Bonapick</span></a>' +
					'<span class="full_version">&nbsp;&nbsp;&nbsp; to start new Bonapick with it</span>' +
					'<div class="separator_popup">or</div>' +
					'<a href="' + domain_name + '/i/' + json_object.short_url + '" target="_blank" class="' + buy_btn_class + '"><span>' + buy_btn_text + '</span></a>' +
					'<span class="full_version">&nbsp;&nbsp;&nbsp; at the best price </span>' +
				'</div>' +
				'<div class="clear"></div>';
		} else if (json_object.request_status == 'active'){
			// invited feed status 'ACTIVE'
			// lets see if this item is already picked
			var pick_btn = $(btn).parent().find('.item_meta .button_green');
			if (pick_btn.length == 1){
				var popup_pick_btn_class = 'button_green';
			} else {
				var popup_pick_btn_class = 'button_grey disabled';
			}
			var template = '' +
				'<div class="column1 active">' +
					'<div class="img" style="background-image:url(\'' + img_url + '\');"></div>' +
					'<a href="#" class="' + popup_pick_btn_class + '"><span>Select This Item</span></a>' +
				'</div>' +
				'<div class="column2 active">' +
					'<h2>' + json_object.title + '</h2>' +
					'<a href="#" class="green_btn_small" onclick="add_to_pick(\''+ encoded_title +'\')"><span>Add to Bonapick</span></a>' +
					'<span class="full_version">&nbsp;&nbsp;&nbsp; to start new Bonapick with it</span>' +
					'<div class="separator_popup">or</div>' +
					'<a href="' + domain_name + '/i/' + json_object.short_url + '" target="_blank" class="' + buy_btn_class + '"><span>' + buy_btn_text + '</span></a>' +
					'<span class="full_version">&nbsp;&nbsp;&nbsp; at the best price </span>' +
				'</div>' +
				'<div class="clear"></div>';
		} else if (json_object.request_status == 'created'){
			// created feed
			var template = '' +
				'<div class="column1">' +
					'<div class="img" style="background-image:url(\'' + img_url + '\');"></div>' +
				'</div>' +
				'<div class="column2">' +
					'<h2>' + json_object.title + '</h2>' +
					'<div class="vote_info" data-json=\'{"percentage":"' + json_object.percentage + '","start_angle":"' + json_object.start_angle + '","winner":"' + json_object.winner + '"}\'>' +
						'<div class="pie"></div><span>' + json_object.percentage + '%</span>' +
						'<p class="right">of people think this one is better than the rest</p>' +
					'</div>' +
					'<a href="' + domain_name + '/i/' + json_object.short_url + '" target="_blank" class="' + buy_btn_class + '"><span>' + buy_btn_text + '</span></a>' +
					'<span class="full_version">&nbsp; at the best price</span>' +
				'</div>' +
				'<div class="clear"></div>';
		} else if (json_object.request_status == 'add_item'){
			var template = '' +
				'<div class="column1">' +
				'<div class="img" style="background-image:url(\'' + img_url + '\');"></div>' +
					'<a href="#" class="button_blue" onclick="$(\'#pick_' + json_object.itemid + '\').click();$(\'#popup .close_popup\').click();"><span>Add item</span></a>' +
				'</div>' +
				'<div class="column2">' +
					'<h2>' + json_object.title + '</h2>' +
					'<div class="zoom_buy">' +
					'<a href="' + json_object.link + '" target="_blank" class="' + buy_btn_class + '"><span>' + buy_btn_text + '</span></a>' +
					'<span class="full_version">&nbsp; '+ buy_price_text + '</span>' +
					'</div>' +
				'</div>' +
				'<div class="clear"></div>';
		} else {
			// all other feeds
			var template = '' +
				'<div class="column1">' +
					'<div class="img" style="background-image:url(\'' + img_url + '\');"></div>' +
				'</div>' +
				'<div class="column2">' +
					'<h2>' + json_object.title + '</h2>' +
					'<div class="vote_info" data-json=\'{"percentage":"' + json_object.percentage + '","start_angle":"' + json_object.start_angle + '","winner":"' + json_object.winner + '"}\'>' +
						'<div class="pie"></div><span>' + json_object.percentage + '%</span>' +
						'<p class="right">of people think this one is better than the rest</p>' +
					'</div>' +
					'<a href="#" class="green_btn_small" onclick="add_to_pick(\''+ encoded_title +'\')"><span>Add to Bonapick</span></a>' +
					'<span class="full_version">&nbsp;&nbsp;&nbsp; to start new Bonapick with it</span>' +
					'<div class="separator_popup">or</div>' +
					'<a href="' + domain_name + '/i/' + json_object.short_url + '" target="_blank" class="' + buy_btn_class + '"><span>' + buy_btn_text + '</span></a>' +
					'<span class="full_version">&nbsp;&nbsp;&nbsp; at the best price</span>' +
				'</div>' +
				'<div class="clear"></div>';
		}

		$('#popup #popup_content').append(template);
		if(typeof json_object.percentage=="number"){
			_self.showPieChart('#popup .vote_info');
		}
		$('#popup #popup_content').show();
		$('#popup .column1 .button_green').bind('click', function(){
			$(btn).parent().find('.item_meta .button_green').click();
			$(this).removeClass('button_green').addClass('button_grey disabled');
			$('#popup .close_popup').click();
			return false;
		});
		$('#popup .column1 .button_grey').bind('click', function(){
			return false;
		});
	};

	// handles orientation change on iPhone
	_self.onOrientationChange = function(){
		switch(window.orientation){  
			case -90:
			case 90:
				$('#popup').removeClass('portrait').addClass('landscape');
				// lets hide popup
				$('#popup .close_popup').click();
				break; 
			default:
				$('#popup').removeClass('landscape').addClass('portrait');
				// lets hide popup
				$('#popup .close_popup').click();
				break; 
		}
	};

	// lets hide menu and tooltips if any open
	$(document).bind('click', function(){
		$(this).find('.tooltip').hide();
		var menu = $(this).find('#user_menu');
		if ($(menu).hasClass('on')){
			$(menu).toggleClass('on');
			$(this).find('.user_menu').toggle();
		}
		$('.share_icon').each(function(){
			if ($(this).hasClass('active')){
				$(this).toggleClass('active');
				$(this).parent().find('ul').toggle();
			}
		});
	});

	// jQuery countdown time wrapper
	_self.countDownTimer = function(element, delta){
		$(element).countdown({
			until: delta,
			compact: true,
			description: ''
		});
	}
	
	// bind a call of the init routine to DOM ready event
	$(document).ready(function(){
		_self.init();
	});
	return _self;
}(BONAPICK, jQuery);

/**
 * Ajax namespace for BONAPICK
 */
BONAPICK.Ajax = function(BONAPICK, $){
	var _self = {};
	var _initialized = false;

	_self.init = function(){
		
	};

	_self.prepareAjax = function(){
		var csrftoken = $.cookie('csrftoken');
		// now lets do a POST call
		function csrfSafeMethod(method){
			// these HTTP methods do not require CSRF protection
			return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
		}
		$.ajaxSetup({
			crossDomain: false, // obviates need for sameOrigin test
			beforeSend: function(xhr, settings) {
				if (!csrfSafeMethod(settings.type)) {
					xhr.setRequestHeader("X-CSRFToken", csrftoken);
				}
			}
		});
	};

	_self.getBaseEndpoint = function(){
		return window.location.protocol + '//' + window.location.host + '/ajax/';
	}

	$(BONAPICK).bind('initialized', function(){
		_self.init();
	});
	return _self;
}(BONAPICK, jQuery);

/**
 * Promo and Featured feeds namespace for BONAPICK
 */
BONAPICK.PromoFeedAjax = function(BONAPICK, ajax, $){
	var _self = {};
	var _initialized = false;

	_self.init = function(){
		$('.featured_request button').click(function(){
			ajax.prepareAjax();
			// first lets get request and item ids
			var button = $(this);
			var value = $(this).attr('value');
			var matches = value.match(/(\d+)/g);
			// lets build the endpoint url
			var endpoint = ajax.getBaseEndpoint() + 'promo/request/' + matches[0] + '/vote/' + matches[1] + '/';
			$.post(endpoint, function(data){
				if (data.success == 'true'){
					// Ok we got successful return lets pause the carousel first
					if (!BONAPICK.carousel_stopped){
						BONAPICK.carousel.stopAuto();
					}
					var list_container = button.parent().parent();
					var i = 0;
					$(list_container).find('li').each(function(){
						var style = $('button', this).attr('style');
						// now lets add this style to the li element instead and empty it.
						$(this).attr('style', style).empty();
						// lets build html to append
						var winner = (data.data[i].winner == 1) ? 'lead' : '';
						var html = '' +
							'<div class="result-circle ' + winner + '" style="display:none;">' +
                            '	<strong>' + data.data[i].percentage + '%</strong>' +
                            '	<small>advise to buy<br>this one</small>' +
                            '</div>';
						// now lets insert new html
						$(this).append(html);
						$(this).find('.result-circle').fadeIn();
						// now lets change the text in the gray area
						if (!$('.title_and_search').hasClass('aftervote')){
							$('.title_and_search').find('.not_voted').hide();
							$('.title_and_search').addClass('aftervote');
							$('.title_and_search').find('.voted').fadeIn();
						}
						i++;
					});
					// Now we need to start carousel when mouse leaves the request
					$('.bx-viewport').mouseleave(function(){
						BONAPICK.carousel.startAuto();
					});
				} else {
					console.log(data);
				}
			});	
			return false;
		});

		/**
		 * Loads more pormo items on the home page via Ajax
		 */
		$('.load_more_promo_requests').click(function(){
			ajax.prepareAjax();
			var button = $(this);
			var json_string = $(button).attr('data-page');
			var json_object = JSON.parse(json_string);
			var data = {
				page: json_object.page,
				limit: json_object.limit
			}
			var main_template = '' +
				'<li class="voting_set">' +
					'<div class="wrapper">' +
						'<div class="question">' +
							'{SHARING_BUTTONS}' +
							'<p>{QUESTION}</p>' +
						'</div>' +
						'<div class="column1 left">' +
							'<div class="image_big"' +
								'style="background-image:url({BACKGROUNDG_IMG});"' +
								'data-json=\'{JSON_DATA}\'>' +
								'<span class="winner_percentage">{PERCENTAGE}%</span>' +
								'<div class="description">' +
									'<p>{TITLE}</p>' +
								'</div>' +
							'</div>' +
						'</div>' +
						'<div class="column2 left">' +
							'<span></span>' +
							'<ol>' +
								'{RELATED_ITEMS}' +
							'</ol>' +
						'</div>' +
					'</div>' +
					'<a href="{DETAILED_LINK}" class="openset_icongreen"></a>' +
				'</li>';
			var related_items_template = '' +
				'<li>' +
					'<a href="#"' +
					   'class="image_small"' +
					   'style="background-image:url({BACKGROUNDG_IMG});"' +
					   'data-json=\'{JSON_DATA}\'>' +
						'<span class="percentage">{PERCENTAGE}%</span>' +
					'</a>' +
				'</li>';
			var sharing_buttons_template = '' +
				'<div class="social_sharing_icons right">' +
					'<a href="#" class="share_icon"></a>' +
					'<ul>' +
						'<li><a target="_blank" href="{FB_SHARING_URL}" class="facebook_icon"></a></li>' +
						'<li><a target="_blank" href="{TWITTER_SHARING_URL}" class="twittershare_icon"></a></li>' +
						'<li><a target="_blank" href="{PINTEREST_SHARING_URL}" class="pinterest_icon"></a></li>' +
						'<li><a target="_blank" href="{GPLUS_SHARING_URL}" class="googleplus_icon"></a></li>' +
						'<li><a href="{EMAIL}" class="email_icon"></a></li>' +
						'<li><a href="{CLIPBOARD}" class="sharelink_icon"></a></li>' +
					'</ul>' +
				'</div>';
			var html = '';
			var endpoint =  ajax.getBaseEndpoint() + 'promo/feed/';

			// lets add spinning wheel
			$(button).text('Loading ');
			$(button).addClass('disabled');
			$(button).css('color', '#555');
			var loading = setInterval(function(){
				if ($(button).text().length < 11){
					$(button).append('.');
				} else {
					$(button).text('Loading ');
				}
			}, 400);

			$.get(endpoint, data, function(data){
				if (data.success == 'true'){
					// 1. loop over results and replace tokens in the template
					for (var i=0; i<data.data.length;i++){
						var request = data.data[i];
						var main_template_html = main_template;
						var sharing_buttons_template_html = sharing_buttons_template;
						var related_html = '';
						var winner_sharing_tokens = {
							'{FB_SHARING_URL}': 'http://www.facebook.com/sharer.php?s=100&p[title]=' + encodeURIComponent(request.sharing.facebook.title).replace(/%20/g,'+') + '&p[summary]=' + encodeURIComponent(request.sharing.facebook.description).replace(/%20/g,'+') + '&p[url]=' + window.location.protocol + '//' + window.location.host + '/' + request.sharing.facebook.link + '&p[images][0]=' + request.sharing.facebook.image,
							'{TWITTER_SHARING_URL}': 'https://twitter.com/share?text=' + encodeURIComponent(request.sharing.twitter.title).replace(/%20/g,'+') + '&url=' + window.location.protocol + '//' + window.location.host + '/' + request.sharing.twitter.link,
							'{PINTEREST_SHARING_URL}': '?url=' + window.location.protocol + '//' + window.location.host + '/' + request.sharing.pinterest.link + '&media=' + request.sharing.pinterest.image + '&description=' + encodeURIComponent(request.sharing.pinterest.title).replace(/%20/g,'+'),
							'{GPLUS_SHARING_URL}': 'https://plus.google.com/share?url=' + window.location.protocol + '//' + window.location.host + '/' + request.sharing.googleplus.link,
							'{EMAIL}': 'mailto:?subject=' + encodeURIComponent(request.sharing.email.title) + '&amp;body=' + encodeURIComponent(request.sharing.email.description) + window.location.protocol + '//' + window.location.host + '/' + request.sharing.email.link,
							'{CLIPBOARD}': window.location.protocol + '//' + window.location.host + '/' + request.sharing.copy.link
						}
						console.log(request);
						// lets do replacements in the template
						for (key in winner_sharing_tokens){
							sharing_buttons_template_html = sharing_buttons_template_html.replace(new RegExp(key, "g"), winner_sharing_tokens[key]);
						}
						for (index in request.items){
							var related_items_template_html = related_items_template;
							var related_items_tokens = {
								'{BACKGROUNDG_IMG}': ((request.items[index].img_url !== 'undefined') ? request.items[index].img_url : ''),
								'{JSON_DATA}': request.items[index].json_data,
								'{PERCENTAGE}': request.items[index].percentage
							}
							// lets do replacements in the template
							for (key in related_items_tokens){
								related_items_template_html = related_items_template_html.replace(new RegExp(key, "g"), related_items_tokens[key]);
							}
							related_html += related_items_template_html;
						}
						var winner_tokens = {
							'{SHARING_BUTTONS}': sharing_buttons_template_html,
							'{QUESTION}': request.question,
							'{BACKGROUNDG_IMG}': ((request.winner.big_img_url !== 'undefined') ? request.winner.big_img_url : ''),
							'{JSON_DATA}': request.winner.json_data,
							'{PERCENTAGE}': request.winner.percentage,
							'{TITLE}': request.winner.title,
							'{RELATED_ITEMS}': related_html,
							'{DETAILED_LINK}': '/request/' + request.auth_url
						}
						// lets do replacements in the template
						for (key in winner_tokens){
							main_template_html = main_template_html.replace(new RegExp(key, "g"), winner_tokens[key]);
						}
						html += main_template_html;
					}
					// 2. append new html to the DOM and re-run javascript
					$(html).hide().insertBefore($('.popular_feed li.clear')).fadeIn().each(function(){
						$(this).find('.image_big').bpPopup({
							before_callback: function(btn){
								var json_string = $(btn).attr('data-json');
								BONAPICK.populatePopup(json_string, btn);
							},
							opacity: 0.5
						});
						$(this).find('a.image_small').bpPopup({
							before_callback: function(btn){
								var json_string = $(btn).attr('data-json');
								BONAPICK.populatePopup(json_string, btn);
							},
							opacity: 0.5
						});
						$(this).find('.sharelink_icon').each(function(){
							var clip = new ZeroClipboard($(this));
							clip.on('dataRequested', function(client, args){
								client.setText($(this).attr('href'));
							});
							clip.on('complete', function(client, args){
								//alert("Copied text to clipboard: " + args.text);
								$('.page-message-wrapper .page-message-text').text('Link URL has been copied to clipboard.');
								$('.page-message-wrapper').slideDown(1000, function(){
									setTimeout(function(){
									   $('.page-message-wrapper').slideUp(1000, function(){});
									},3000);
								});
							});
						});
					});
					// 3. append url fragment to the uri
					if (location.search){
						var url = location.search;
						var digRe = /page=(\d+)/gi;
						var matches = digRe.exec(url);
						var page_num = Number(matches[1]) + 1;
						window.history.pushState({"page": page_num}, document.title, "/?page=" + page_num + "#show_last");
					} else {
						window.history.pushState({"page": 2}, document.title, "/?page=2#show_last");
					}
					// 4. hide the button, "or" and spinning wheel if "more" is false
					clearInterval(loading);
					if (data.more){
						$(button).text('See More Bonapicks');
						$(button).removeClass('disabled');
					} else {
						$(button).parent().parent().hide();
					}
					// 5. recalculate navachors position
					// lets add data-top to all anchors
					$('.nav_anchor').each(function(){
						var offset = $(this).offset();
						$(this).attr('data-top', offset.top);
					});
				} else {
					console.log(data);
					// hide spinning wheel
					clearInterval(loading);
					// display error notification
					$(button).text('There was an error. Please reload the page.');
				}
			});
			return false;
		});
	};

	$(BONAPICK).bind('initialized', function(){
		_self.init();
	});
	return _self;
}(BONAPICK, BONAPICK.Ajax, jQuery);

(function($){
$.fn.bpPopup = function(o){
	o = $.extend({
		popup: 'popup',
		stopper: 'close_popup',
		overlay: 'backgroundPopup',
		opacity: '0.7',
		width: 0,
		callback: false,
		close_callback: false,
		before_callback: false
    }, o || {});

	return this.each(function(){

		var starter = $(this);
	
		//SETTING UP OUR POPUP
		//0 means disabled; 1 means enabled;
		var popupStatus = 0;

		//loading popup with jQuery magic!
		function loadPopup(){
			//loads popup only if it is disabled
			if(popupStatus==0){
				$('#'+o.overlay).css({
					"opacity": o.opacity
				});
				$('#'+o.overlay).css("background", "#000");
				$('#'+o.overlay).fadeIn("fast");
				$('#'+o.popup).css("visibility", "visible");
				$('#'+o.popup).fadeIn("fast");
				popupStatus = 1;
			}
		};

		//disabling popup with jQuery magic!
		function disablePopup(){
			//disables popup only if it is enabled
			if(popupStatus==1){
				$('#'+o.overlay).fadeOut("fast");
				$('#'+o.popup).fadeOut("fast");
				popupStatus = 0;
				
				// reload any child iframe in the popup, if exists
			    var frm = $('#'+ o.popup + ' > iframe');
				if (frm) {
					frm.attr('src', frm.attr('src'));
				}
			}
		};

		//centering popup
		function centerPopup(){
			//request data for centering
			var windowWidth = document.documentElement.clientWidth;
			var windowHeight = document.documentElement.clientHeight;
			var popupHeight = $('#'+o.popup).height();
			var popupWidth = $('#'+o.popup).width();
			if (o.width) {
				popupWidth = o.width;
				//centering
				$('#'+o.popup).css({
					"position": "fixed",
					"top": windowHeight/2-popupHeight/2,
					"left": windowWidth/2-popupWidth/2,
					"width":o.width
				});
			} else {
				//centering
				$('#'+o.popup).css({
					"position": "fixed",
					"top": windowHeight/2-popupHeight/2,
					"left": windowWidth/2-popupWidth/2
				});
			}

			$('#'+o.overlay).css({
				"height": windowHeight,
				"position": "fixed"
			});
		};

		//LOADING POPUP
		//Click the button event!
		$(starter).click(function(){
			if (o.before_callback !== false){
			    // execute the before_callback, passing parameters as necessary
			    o.before_callback.call(this, starter);
			}

			//centering with css
			centerPopup();
			
			//load popup
			loadPopup();

			if (o.callback !== false){
			    // execute the callback, passing parameters as necessary
			    o.callback.call();
			}
			return false;
		});
	
		//CLOSING POPUP
		//Click the x event!
		$('.'+o.stopper).click(function(){
			disablePopup();
			if (o.close_callback !== false){
			    // execute the callback, passing parameters as necessary
			    o.close_callback.call();
			}
			return false;
		});
		//Click out event!
		$('#'+o.overlay).click(function(){
			disablePopup();
			return false;
		});
	});
};
})(jQuery);
