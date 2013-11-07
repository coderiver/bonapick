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
		$('#menu .black_btn').bind('click', function(){
			$('#menu .login_menu').toggle();
			return false;
		});

		$('#carousel_slides').responsiveSlides({
			nav: true,
			pager: true,
			prevText: "<span class='arrow_left'></span>",
			nextText: "<span class='arrow_right'></span>",
		});
		
		// lets make navbar stick on height offset
		$(document).scroll(function(){
			// sticky panel
			// If has not activated (has no attribute "data-top")
			if (!$('nav').attr('data-top')){
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
			
			// nav menues
			$('.nav_anchor').each(function(){
				if (!$(this).attr('data-top')){
					var offset = $(this).offset();
					$(this).attr('data-top', offset.top);
				}
				if ($(this).attr('data-top') - 110 <= $(document).scrollTop()){
					var menu_name = $(this).attr('name');
					$('#menu a').each(function(){
						// lets disable all first
						$(this).removeClass('active');
						if ($(this).attr('href') == '#' + menu_name){
							$(this).addClass('active');
						}
					});
				}
			});
		});
		
		// if menu link is clicked
		$('#menu a').click(function(){
			var menu_name = $(this).attr('href').substring(1);
			// lets find the anchors position
			var anchor_position = $('.nav_anchor[name="' + menu_name + '"]').attr('data-top');

			$('html, body').animate({
				scrollTop: (anchor_position - 110)
			}, 100);
			
			return false;	
		});
		
		// scroll to the top of the page
		$('.up_link').click(function(){
			$('html, body').animate({scrollTop:0}, 100);
			return false;
		});
		
		// show and hide tooltip menu in the feed on a home page
		(function(){
			var feed = $('.home .popular_feed');
			var initialized = false;
			
			$('.image_big', feed).bind('click', function(e){
				if ($('.reuse', this).css('visibility') != 'hidden'){
					$('.reuse', this).css('visibility','hidden');
					initialized = false;
				
				} else if (initialized){
					// lets hide if visible
					$('.image_big .reuse', feed).each(function(){
						$(this).css('visibility','hidden');
					});
					$('.reuse', this).css('visibility','visible');
					// prevent event bubbling
					e.stopPropagation();

				} else {
					$('.reuse', this).css('visibility','visible');
					initialized = true;
					// prevent event bubbling
					e.stopPropagation();
				}
			});
			
			$(document).bind('click', function(){
				if (initialized){
					// hide all
					$('.image_big .reuse', feed).each(function(){
						$(this).css('visibility','hidden');
					});
					initialized = false;
				}
			});
		})();
		
		// add sign in handler
        $("#sign_in_btn").click(function(){
            $("#login_form").submit();
            return false;
        });
		
        //add search handler to unauthenticated home page
        $("#home_search_btn").click(function(){
           $("#search_form").submit();
        });

		// trigger initialize event
		_initialized = true;
		$(this).trigger('initialized');
	};	
	
	// bind a call of the init routine to DOM ready event
	$(document).ready(function(){
		_self.init();
	});
	return _self;
}(BONAPICK, jQuery);