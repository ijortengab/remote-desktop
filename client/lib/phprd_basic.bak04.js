$(document).ready(function(){

	function getCoordinatWindow(e){
		if( !e ) {
			if( window.event ) {
				//Internet Explorer 8-
				e = window.event;
			} else {
				//total failure, we have no way of referencing the event
				return;
			}
		}

		if( typeof( e.pageX ) == 'number' ) {
			//most browsers
			var xcoord = e.pageX;
			var ycoord = e.pageY;
		} else if( typeof( e.clientX ) == 'number' ) {
			//Internet Explorer 8- and older browsers
			//other browsers provide this, but follow the pageX/Y branch
			var xcoord = e.clientX;
			var ycoord = e.clientY;
			var badOldBrowser = ( window.navigator.userAgent.indexOf( 'Opera' ) + 1 ) || ( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) || ( navigator.vendor == 'KDE' );
			if( !badOldBrowser ) {
				if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
					//IE 4, 5 & 6 (in non-standards compliant mode)
					xcoord += document.body.scrollLeft;
					ycoord += document.body.scrollTop;
				} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
					//IE 6 (in standards compliant mode)
					xcoord += document.documentElement.scrollLeft;
					ycoord += document.documentElement.scrollTop;
				}
			}
		}
		else {
			return ;
		}

		var xycoord = [xcoord, ycoord];
		return xycoord;		
	}

	function ajaxMsg(text){
		var left = $(window).width()/2;
		$(".ajax_msg").css({'left': left});
		$('.ajax_msg').show().text(text);
	}

	$("#form_client").submit(function(event) {

			var $form = $( this ),
			client_action = $form.find( 'input[name="client_action"]' ).val(),
			client_action_screenshot_reload = $form.find( 'input[name="client_action_screenshot_reload"]' ).val(),
			url = $form.attr( 'action' );

			$.post( url, { 	client_action: client_action,
							client_action_screenshot_reload: client_action_screenshot_reload
							}, function(data) {
				if(data.id == 1){

					$('#img').show();
					$('.ajax_msg').text('Loading...');

					var img = new Image();

					// $('#hideimage').load(data.extra, function(){
					$(img).load(data.extra, function(){
						// $('#hideimage').attr('src', img);
						$("#img").animate({ //
							opacity: 0,
						},0,function(){
							$("#img").css('background-image', 'url('+data.extra+')');
							$('#img').animate({
								opacity: 1,
							},500,function(){
								$("#img-background").css('background-image', 'url('+data.extra+')');
							});
							// $('.ajax_msg').text(data.msg);
							$('.ajax_msg').fadeOut(300);
						});
					});
				}
				else{
					$('.ajax_msg').text(data.msg);
					$('#img').show();
				}
			}, 'json');

			event.preventDefault();
		});

	$("#img").click(function(){
		ajaxMsg('Waiting...');
		$('#img').hide();
		$("#form_client").submit();

		var CoordinatWindowXY = getCoordinatWindow(arguments[0]);		
		var CoordinatX = CoordinatWindowXY[0] - this.offsetLeft;
		var CoordinatY = CoordinatWindowXY[1] - this.offsetTop;		
		// alert('X = ' + CoordinatX + '; Y = ' + CoordinatY);
		
	});

});