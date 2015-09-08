(function($){
	window.onload = function() {
		var widgetInner = document.getElementById('widgetInner'),
	        widgetButton = document.getElementById('widgetButton'),
	        widgetBody = document.getElementById('widgetBody');
		
		widgetBody.style.visibility = 'hidden';
		
		$(document).on('click', function() {
			if($(widgetInner).hasClass('active')) {
				widgetBody.style.visibility = 'visible';
			} else {
				widgetBody.style.visibility = 'hidden';
			}
		});	
	};
})(jQuery);
