$(document).ready(function() {

	jQuery('.js-drop').click(function (event) {
		jQuery(this).parent().toggleClass('is-active');
	});

});