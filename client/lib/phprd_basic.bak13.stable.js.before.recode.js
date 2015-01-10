// http://
(function($) {
	$.fn.autoScrollMouseMove = function() {

		// basic variable
		var frame = this;
		functions = new Object();
		var arrowRight = 'roji-arrow-right';
		var arrowLeft = 'roji-arrow-left';
		var arrowTop = 'roji-arrow-top';
		var arrowBottom = 'roji-arrow-bottom';
		var arrow = 'roji-arrow';
		var paddingtmp = frame.css('padding-top').split('px');
		var paddingT = parseInt(paddingtmp[0]);
		var paddingtmp = frame.css('padding-bottom').split('px');
		var paddingB = parseInt(paddingtmp[0]);
		var paddingtmp = frame.css('padding-right').split('px');
		var paddingR = parseInt(paddingtmp[0]);
		var paddingtmp = frame.css('padding-left').split('px');
		var paddingL = parseInt(paddingtmp[0]);
		//
		var scrollMaxWidth = 0;
		var scrollMaxHeight = 0;
		var mentokR = false;
		var mentokB = false;
		var tmpR = 0;
		var tmpB = 0;
		var timer;
		//
		tmpX = 0;
		tmpY = 0;

		// fix requirement
		// frame.css('overflow','hidden');

		// function ajaxMsg2(text, hide=null, delay=null){
			// var id = ".ajax_msg";
			// var left = $(window).width()/4;
			// $(id).css({'left': left}).show().text(text);
			// if(hide != null) {
				// if(delay != null) $(id).delay(delay).fadeOut(hide);
				// else $(id).fadeOut(hide);
			// }
		// }

		function forceTo(method, element){
			switch(method){
				case 'show':
					if($(element).css('display') == 'none') $(element).show();
				break;
				case 'hide':
					if($(element).css('display') != 'none') $(element).hide();
				break
			}
		}

		// build a new element
		frame.append(  '<div class="' + arrow + '" id="' + arrowRight 	+ '" style="opacity:0.1;z-index:2;display:none;height:400px;width:100px;position:fixed;background:none;top:0;right:0;"><!-- Right --></div>'
						+ '<div class="' + arrow + '" id="' + arrowLeft 	+ '" style="opacity:0.1;z-index:2;display:none;height:400px;width:100px;position:fixed;background:none;top:0;left:0;"><!-- Left --></div>'
						+ '<div class="' + arrow + '" id="' + arrowBottom 	+ '" style="opacity:0.1;z-index:2;display:none;height:100px;width:400px;position:fixed;background:none;bottom:0;left:0;"><!-- Bottom --></div>'
						+ '<div class="' + arrow + '" id="' + arrowTop 		+ '" style="opacity:0.1;z-index:2;display:none;height:100px;width:400px;position:fixed;background:none;top:0;left:0;"><!-- Top --></div>');

		frame.scroll(function(){

			currentScrollLeft = frame.scrollLeft();
			currentScrollTop = frame.scrollTop();
			
			if(currentScrollLeft > scrollMaxWidth){
				mentokR = false;//penting jika pergerakan mouse keluar jalur dari frame
				scrollMaxWidth = currentScrollLeft;
			}
			if(currentScrollTop > scrollMaxHeight){
				mentokB = false;//penting jika pergerakan mouse keluar jalur dari frame
				scrollMaxHeight = currentScrollTop;
			}
			
			clearTimeout(timer);
			timer = setTimeout( function () {
				if($coordinat.x > $startMoveR){
					if($coordinat.x == tmpR){
						mentokR = true;
					}
				}				
				if($coordinat.y > $startMoveB){
					if($coordinat.y == tmpB){
						mentokB = true;
					}
				}
			}, 150 );
			
			// var debug = '';
			// debug += 'x: ' + $cursorPosition.x + ',';
			// debug += 'y: ' + $cursorPosition.y + ';';
			// debug += 'wW: ' + frameWidth + ';';
			// debug += 'wH: ' + frameHeight + ';';
			// debug += '$sDX: ' + $scrollDistanceX + ';';
			// debug += '$sDY: ' + $scrollDistanceY + ';';
			// debug += '$lengthFrameX: ' + $lengthFrameX + ';';
			// debug += '$lengthFrameY: ' + $lengthFrameY + ';';
			// debug += '$startMoveT: ' + $startMoveT + ';';
			// debug += '$startMoveR: ' + $startMoveR + ';';
			// debug += '$startMoveL: ' + $startMoveL + ';';
			// debug += '$startMoveB: ' + $startMoveB + ';';
			// debug += 'c.x: ' + $coordinat.x + ';';
			// debug += 'c.y: ' + $coordinat.y + ';';
			// debug += 'tmpX: ' + tmpX + ';';
			// debug += 'tmpY: ' + tmpY + ';';
			// debug += 'scrollMaxWidth: ' + scrollMaxWidth + ';';
			// debug += 'scrollMaxHeight: ' + scrollMaxHeight + ';';
			// debug += 'mentokR: ' + mentokR + ';';
			// debug += 'mentokB: ' + mentokB + ';';
			// debug += 'tmpR: ' + tmpR + ';';
			// debug += 'tmpB: ' + tmpB + ';';
			// ajaxMsg2(debug);
			
		});

		frame.mousemove(function(e){

			// DEFINE basic measure
			frameWidth = frame.width() + paddingR + paddingL; // sudah termasuk lebar dari scroll vertical
			frameHeight = frame.height() + paddingT + paddingB; // sudah termasuk lebar dari scroll horizontal
			windowScrollTop = $(window).scrollTop();
			windowScrollLeft = $(window).scrollLeft();

			// cursor
			var cursor = {x:0, y:0};
			var cursorOverFrame = {x:0, y:0};
			if (e.pageX || e.pageY) {
				cursor.x = e.pageX;
				cursor.y = e.pageY;
			}
			else {
				var de = document.documentElement;
				var b = document.body;
				cursor.x = e.clientX + ((de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0));
				cursor.y = e.clientY + ((de.scrollTop || b.scrollTop) - (de.clientTop || 0));
			}

			cursorOverFrame.x = cursor.x - frame.offset().left + frame.scrollLeft();
			cursorOverFrame.y = cursor.y - frame.offset().top + frame.scrollTop();

			// DYNAMIC DEFINE because of cursor
			$cursorPosition = cursor;
			$coordinat = cursorOverFrame;

			// DEFINE margin
			marginTop = frameHeight/3;
			marginRight = frameWidth/3;
			marginBottom = frameHeight/3;
			marginLeft = frameWidth/3;

			// DYNAMIC DEFINE because of scroll
			$scrollDistanceX = frame.scrollLeft();
			$scrollDistanceY = frame.scrollTop();
			$lengthFrameX = frameWidth + $scrollDistanceX;
			$lengthFrameY = frameHeight + $scrollDistanceY;
			$startMoveR = $lengthFrameX - marginRight;
			$startMoveL = ($lengthFrameX - frameWidth) + marginLeft;
			$startMoveT = ($lengthFrameY - frameHeight) + marginTop;
			$startMoveB = $lengthFrameY - marginBottom;

			// manipulate css
			$('#' + arrowRight).css({'width': marginRight, 'left': frameWidth  + frame.offset().left - marginRight  , 'top': frame.offset().top - windowScrollTop, 'height': frameHeight});
			$('#' + arrowLeft).css({'width': marginLeft, 'left': frame.offset().left, 'top': frame.offset().top - windowScrollTop, 'height': frameHeight});
			$('#' + arrowBottom).css({'width': frameWidth, 'left': frame.offset().left, 'top': frameHeight + frame.offset().top - marginBottom - windowScrollTop, 'height': marginBottom});
			$('#' + arrowTop).css({'width': frameWidth, 'left': frame.offset().left, 'top': frame.offset().top - windowScrollTop, 'height': marginTop});

			// horizontal, scroll to right
			if($scrollDistanceX == scrollMaxWidth && mentokR == true ){
				forceTo('hide', '#' + arrowRight);				
			}
			else if($coordinat.x > $startMoveR && $coordinat.x > tmpX){
				forceTo('show', '#' + arrowRight);				
				tmpR = $coordinat.x;
			}
			else if($coordinat.x > $startMoveR && $coordinat.x < tmpX){
				forceTo('hide', '#' + arrowRight);
			}

			// horizontal, scroll to left
			if($scrollDistanceX == 0){
				forceTo('hide', '#' + arrowLeft);
			}
			else if($coordinat.x < $startMoveL && $coordinat.x < tmpX){
				forceTo('show', '#' + arrowLeft);
			}
			else if($coordinat.x < $startMoveL && $coordinat.x > tmpX){
				forceTo('hide', '#' + arrowLeft);
			}

			// vertical, scroll to bottom
			if($scrollDistanceY == scrollMaxHeight && mentokB == true ){
				forceTo('hide', '#' + arrowBottom);
			}
			else if($coordinat.y > $startMoveB && $coordinat.y > tmpY){
				forceTo('show', '#' + arrowBottom);
				tmpB = $coordinat.y;
			}
			else if($coordinat.y > $startMoveB && $coordinat.y < tmpY){
				forceTo('hide', '#' + arrowBottom);
			}

			// vertical, scroll to top
			if($scrollDistanceY == 0){
				forceTo('hide', '#' + arrowTop);
			}
			else if($coordinat.y < $startMoveT && $coordinat.y < tmpY){
				forceTo('show', '#' + arrowTop);
			}
			else if($coordinat.y < $startMoveT && $coordinat.y > tmpY){
				forceTo('hide', '#' + arrowTop);
			}

			// update temporary value
			tmpY = $coordinat.y;
			tmpX = $coordinat.x;
			
			// var debug = '';
			// debug += 'x: ' + $cursorPosition.x + ',';
			// debug += 'y: ' + $cursorPosition.y + ';';
			// debug += 'wW: ' + frameWidth + ';';
			// debug += 'wH: ' + frameHeight + ';';
			// debug += '$sDX: ' + $scrollDistanceX + ';';
			// debug += '$sDY: ' + $scrollDistanceY + ';';
			// debug += '$lengthFrameX: ' + $lengthFrameX + ';';
			// debug += '$lengthFrameY: ' + $lengthFrameY + ';';
			// debug += '$startMoveT: ' + $startMoveT + ';';
			// debug += '$startMoveR: ' + $startMoveR + ';';
			// debug += '$startMoveL: ' + $startMoveL + ';';
			// debug += '$startMoveB: ' + $startMoveB + ';';
			// debug += 'c.x: ' + $coordinat.x + ';';
			// debug += 'c.y: ' + $coordinat.y + ';';
			// debug += 'tmpX: ' + tmpX + ';';
			// debug += 'tmpY: ' + tmpY + ';';
			// debug += 'scrollMaxWidth: ' + scrollMaxWidth + ';';
			// debug += 'scrollMaxHeight: ' + scrollMaxHeight + ';';
			// debug += 'mentokR: ' + mentokR + ';';
			// debug += 'mentokB: ' + mentokB + ';';
			// debug += 'tmpR: ' + tmpR + ';';
			// debug += 'tmpB: ' + tmpB + ';';
			// ajaxMsg2(debug);
		});

		$('.' + arrow).mouseenter(function(){
			functions.startScroll();
		});

		$('.' + arrow).mouseleave(function(){
			functions.stopScroll();
			$(this).hide();
		});

		functions.startScroll = function(){

			center = {x:0,y:0};

			center.x = Math.round(frameWidth/2 + frame.offset().left);
			center.y = Math.round(frameHeight/2 + frame.offset().top);

			scrolling = setInterval(function() {

				// horizontal
				var currentPositionX = frame.scrollLeft();
				// vertical
				var currentPositionY = frame.scrollTop();

				//cari persentase
				if($cursorPosition.x > center.x) {
					var startX = Math.round(frame.width() + frame.offset().left - marginRight);
					percentX = Math.ceil(($cursorPosition.x - startX) / marginRight * 100);
				}
				else if($cursorPosition.x < center.x) {
					var startX = frame.offset().left + marginLeft;
					percentX = Math.ceil((startX - $cursorPosition.x) / marginLeft * 100);
				}
				if($cursorPosition.y > center.y) {
					var startY = Math.round(frame.height() + frame.offset().top - marginBottom);
					percentY = Math.ceil(($cursorPosition.y - startY) / marginBottom * 100);
				}
				else if($cursorPosition.y < center.y) {
					var startY = Math.round(frame.offset().top + marginTop);
					percentY = Math.ceil((startY - $cursorPosition.y) / marginTop * 100);
				}

				//cari perpindahan // 1, 5, 10, 20, 40 (speed)
				pointX = (percentX < 0) ? 0 :
						((percentX > 90) ? 40 :
						((percentX > 70) ? 20 :
						((percentX > 50) ? 10 :
						((percentX > 30) ? 5 : 1))));
				pointY = (percentY < 0) ? 0 :
						((percentY > 90) ? 40 :
						((percentY > 70) ? 20 :
						((percentY > 50) ? 10 :
						((percentY > 30) ? 5 : 1))));
				if($cursorPosition.x > center.x) {
					nextPositionX = currentPositionX+pointX;
				}
				else if($cursorPosition.x < center.x) {
					nextPositionX = currentPositionX-pointX;
				}
				if($cursorPosition.y > center.y) {
					nextPositionY = currentPositionY+pointY;
				}
				else if($cursorPosition.y < center.y) {
					nextPositionY = currentPositionY-pointY;
				}

				// scrolling
				frame.scrollLeft(nextPositionX);
				frame.scrollTop(nextPositionY);

				// set cursor
				if($cursorPosition.x > center.x && $cursorPosition.y > center.y && percentX > 0 && percentY > 0) {
					$('body').css({cursor:'se-resize'});
				}
				else if($cursorPosition.x > center.x && $cursorPosition.y < center.y && percentX > 0 && percentY > 0) {
					$('body').css({cursor:'ne-resize'});
				}
				else if($cursorPosition.x < center.x && $cursorPosition.y > center.y && percentX > 0 && percentY > 0) {
					$('body').css({cursor:'sw-resize'});
				}
				else if($cursorPosition.x < center.x && $cursorPosition.y < center.y && percentX > 0 && percentY > 0) {
					$('body').css({cursor:'nw-resize'});
				}
				else if($cursorPosition.x > center.x && percentY < 0) {
					$('body').css({cursor:'e-resize'});
				}
				else if($cursorPosition.x < center.x && percentY < 0) {
					$('body').css({cursor:'w-resize'});
				}
				else if($cursorPosition.y > center.y && percentX < 0) {
					$('body').css({cursor:'s-resize'});
				}
				else if($cursorPosition.y < center.y && percentX < 0) {
					$('body').css({cursor:'n-resize'});
				}

			}, 40);
		};

		functions.stopScroll = function(){
			if(!scrolling) return;
			clearInterval(scrolling);
			$('body').css({cursor:'default'});// set cursor
		};

	}
})(jQuery);

// http://stackoverflow.com/questions/2897155/get-caret-position-within-an-text-input-field
(function($) {
	$.fn.getCursorPosition = function() {
		var input = this.get(0);
		if (!input) return; // No (input) element found
		if ('selectionStart' in input) {
			// Standard-compliant browsers
			return input.selectionStart;
		} else if (document.selection) {
			// IE
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			return sel.text.length - selLen;
		}
	}
})(jQuery);

// http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
(function($) {
  $.fn.setCursorPosition = function(pos) {
	if ($(this).get(0).setSelectionRange) {
	  $(this).get(0).setSelectionRange(pos, pos);
	} else if ($(this).get(0).createTextRange) {
	  var range = $(this).get(0).createTextRange();
	  range.collapse(true);
	  range.moveEnd('character', pos);
	  range.moveStart('character', pos);
	  range.select();
	}
  }
})(jQuery);

$(document).ready(function(){
	
	$('#page').autoScrollMouseMove();
	
	////////////////////////
	// function
	////////////////////////


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

	function ajaxMsg(text, hide=null, delay=null){
		var id = ".ajax_msg";
		var left = $(window).width()/4;
		$(id).css({'left': left}).show().text(text);
		if(hide != null) {
			if(delay != null) $(id).delay(delay).fadeOut(hide);
			else $(id).fadeOut(hide);
		}
	}

	function setMsg(elementID, text, hide=null, delay=null){
		$(elementID).text(text).show();
		if(hide != null) {
			if(delay != null) $(elementID).delay(delay).fadeOut(hide);
			else $(elementID).fadeOut(hide);
		}
	}

	function specialInsertToTextArea(idTextArea, string){

		var currentTextareaValue = $(idTextArea).val(); // current textarea value

		var currentCursorPosition = $(idTextArea).getCursorPosition(); // current cursor position

		var newTextareaValue;

		var newCursorPosition;

		if(currentTextareaValue.length == 0){ // if no value in textarea
			newCursorPosition = string.length;
			newTextareaValue = string;
		}
		else if(currentCursorPosition == 0){ // cursor at the first
			newCursorPosition = string.length;
			newTextareaValue = string + currentTextareaValue;
		}
		else if(currentCursorPosition == currentTextareaValue.length){ // cursor at the last
			newCursorPosition = currentTextareaValue.length + string.length;
			newTextareaValue = currentTextareaValue + string;
		}
		else { // and now for cursor at middle

			// prepare
			var $left = '';
			var $right = '';

			//split current value textarea for the left and right from Cursor
			for(var i = 0; i < currentTextareaValue.length; i++){
				if(i < currentCursorPosition) $left += currentTextareaValue[i];
				else $right += currentTextareaValue[i];
			}

			newCursorPosition = currentCursorPosition + string.length;
			newTextareaValue = $left + string + $right;
		}

		$(idTextArea).val(newTextareaValue).focus().setCursorPosition(newCursorPosition);
	}

	////////////////////////
	// submit(function(){});
	////////////////////////

	$("#form_client").submit(function(event) {
			ajaxMsg('Waiting...');
			$('#img').hide();

			var $form = $(this);
			var url = $form.attr( 'action' );
			var variableForm = {
				client_action: $form.find( 'input[name="client_action"]' ).val(),
				client_action_screenshot_reload: $form.find( 'input[name="client_action_screenshot_reload"]' ).val(),
				client_action_mouse_action: $form.find( 'input[name="client_action_mouse_action"]' ).val(),
				client_action_mouse_mode: $form.find( 'input[name="client_action_mouse_mode"]' ).val(),
				client_action_click_x: $form.find( 'input[name="client_action_click_x"]' ).val(),
				client_action_click_y: $form.find( 'input[name="client_action_click_y"]' ).val(),
				client_action_click_button: $form.find( 'input[name="client_action_click_button"]' ).val(),
				client_action_click_count: $form.find( 'input[name="client_action_click_count"]' ).val(),
				client_action_keystroke: $form.find( 'textarea[name="client_action_keystroke"]' ).val()};

			// clear value
			$("#form_client").find( 'textarea[name="client_action_keystroke"]' ).val('');

			$.post( url, variableForm , function(data) {
				// clear value
				$("#form_client").find( 'input[name="client_action_click_x"]' ).val('');
				$("#form_client").find( 'input[name="client_action_click_y"]' ).val('');
				$("#form_client").find( 'input[name="client_action_mouse_action"]' ).val('');
				$("#form_client").find( 'input[name="client_action_mouse_mode"]' ).val('');
				$("#form_client").find( 'input[name="client_action_click_button"]' ).val('');
				$("#form_client").find( 'input[name="client_action_click_count"]' ).val('');



				if(data.result == 1){

					$('.ajax_msg').text(data.msg);	//Loading...
					var cssObj = {'background-image' : 'url('+data.screenshot+')', 'width' : data.width, 'height' : data.height};
					var hide = {opacity : 0};
					var unhide = {opacity : 1};
					var img = new Image();

					$(img).load(data.screenshot, function(){
						$('.ajax_msg').hide();
						$("#img").css(cssObj);
						$("#img").animate(hide,0,function(){ // tidak ada fungsi complete pada css(), maka digunakan animate yang memiliki fungsi complete
							$('#img').show(function(){
								$("#img").animate(unhide,300,function(){
									$("#img-disabled").css(cssObj);
									$("#img-background").css(cssObj);
								});
							});
						});
					});
				}
				else{
					// $('.ajax_msg').text(data.msg).delay(2000).fadeOut(1000);
					$('.ajax_msg').text(data.msg);
					$('#img').show();
				}

			}, 'json');

			event.preventDefault();
		});

	////////////////////////
	// keydown(function(){});
	////////////////////////

	$(document).keydown(function(event){
		// alert(event.keyCode);
		var keyCodeEsc = 27;
		var keyCodeK = 75;
		if(event.keyCode == keyCodeEsc){
			if($("#keystroke_area").css('display') != 'none'){
				$("#keystroke_area").fadeOut();
				event.preventDefault();
			}
		}
		if(event.ctrlKey && event.shiftKey && event.keyCode == keyCodeK){
			$("#keystroke_button").click();
			event.preventDefault();
		}
	});

	$('#keystroke_input').keydown(function(event){

		var keyCodeEnter = 13;
		var keyCodeDelete = 46;
		var keyCodeInsert = 45;
		var keyCodeLetterS = 83;

		if(event.ctrlKey && event.keyCode == keyCodeEnter){
			$("#form_client").submit();
			event.preventDefault();
		}
		else if(event.ctrlKey && event.keyCode == keyCodeLetterS){
			alert('save now');
			return false;
		}
		else if(event.ctrlKey && event.keyCode == keyCodeInsert){
			alert('load now');
			event.preventDefault();
		}
		else if(event.keyCode == keyCodeEnter){
			specialInsertToTextArea('#keystroke_input', '{enter}');
			event.preventDefault();
		}


		// alert(event.keyCode);

	});

	////////////////////////
	// change(function(){});
	////////////////////////

	$('.specific_character').change(function(){

		var $value = $(this).val();

		if($('#special_alt').prop('checked')) $value = '{alt down}' + $value + '{alt up}';
		if($('#special_shift').prop('checked')) $value = '{shift down}' + $value + '{shift up}';
		if($('#special_ctrl').prop('checked')) $value = '{ctrl down}' + $value + '{ctrl up}';

		specialInsertToTextArea('#keystroke_input',$value);

		setMsg('#message2', 'Inserted', 300, 1500);

		$(this).val('none').attr('selected', 'selected');
		if($('#special_ctrl').prop('checked')) $('label[for="special_ctrl"]').click();
		if($('#special_shift').prop('checked')) $('label[for="special_shift"]').click();
		if($('#special_alt').prop('checked')) $('label[for="special_alt"]').click();

	});

	////////////////////////
	// click(function(){});
	////////////////////////

	$("#img").click(function(){
		// prepare
		var CoordinatWindowXY = getCoordinatWindow(arguments[0]);
		var CoordinatX = CoordinatWindowXY[0] - this.offsetLeft;
		var CoordinatY = CoordinatWindowXY[1] - this.offsetTop;
		var CoordinatX = CoordinatWindowXY[0] - this.offsetLeft + $("#page").scrollLeft();
		var CoordinatY = CoordinatWindowXY[1] - this.offsetTop + $("#page").scrollTop();

		$("#form_client").find( 'input[name="client_action_click_x"]' ).val(CoordinatX);
		$("#form_client").find( 'input[name="client_action_click_y"]' ).val(CoordinatY);
		$("#form_client").find( 'input[name="client_action_mouse_action"]' ).val('click');
		$("#form_client").find( 'input[name="client_action_mouse_mode"]' ).val('Screen');
		$("#form_client").find( 'input[name="client_action_click_button"]' ).val('left');
		$("#form_client").find( 'input[name="client_action_click_count"]' ).val('1');
		// submit
		// $("#form_client").submit();
	});

	$("#keystroke_button").click(function(){
		var $height = $(window).height()/2;
		var $width = $(window).width()/2;
		var $left = $(window).width()/4;
		var keystrokeShow = {bottom:'0'};
		var keystrokeHide = {bottom:'-' + $height +'px'};
		if($("#keystroke_area").css('display') == 'none'){
			$("#keystroke_area").css({	position:'fixed',
										width: $width + 'px',
										height: $height + 'px',
										left: $left + 'px',
										bottom: '-' + $height +'px'}).show().animate(keystrokeShow, 300);
			$("#keystroke_input").focus();
		}
		else{
			$("#keystroke_area").animate(keystrokeHide, 150, function(){
				$("#keystroke_area").hide()
			});
		}


	});

	$('label[for="special_ctrl"]').click(function(){
		if($('#special_ctrl').prop('checked')) $(this).css('color','#999999');
		else $(this).css('color','#000000');
	});

	$('label[for="special_shift"]').click(function(){
		if($('#special_shift').prop('checked')) $(this).css('color','#999999');
		else $(this).css('color','#000000');
	});

	$('label[for="special_alt"]').click(function(){
		if($('#special_alt').prop('checked')) $(this).css('color','#999999');
		else $(this).css('color','#000000');
	});

	$('.action').click(function(){
		$(this).each(function(){
			var id = $(this).attr('id');
			if(id == 'send'){
				$("#form_client").submit();
			}
			if(id == 'load'){
				alert('load now');
				// $('#keystroke_input').val('').focus();
			}
		});
	});

	////////////////////////
	// mouse(function(){});
	////////////////////////



alert('a');
});
