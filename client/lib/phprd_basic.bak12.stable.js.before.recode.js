// http://
(function($) {
	$.fn.autoScroll = function(target) {

		if(!target) return false;
		
		// basic variable
		var frame = this;
		functions = new Object();
		var arrowRight = 'roji-arrow-right';
		var arrowLeft = 'roji-arrow-left';
		var arrowTop = 'roji-arrow-top';
		var arrowBottom = 'roji-arrow-bottom';
		var arrow = 'roji-arrow';
		deltaX = target.offset().left - frame.offset().left;
		deltaY = target.offset().top - frame.offset().top;


		function ajaxMsg2(text, hide=null, delay=null){
			var id = ".ajax_msg";
			var left = $(window).width()/4;
			$(id).css({'left': left}).show().text(text);
			if(hide != null) {
				if(delay != null) $(id).delay(delay).fadeOut(hide);
				else $(id).fadeOut(hide);
			}
		}

		// fix requirement
		// frame.css('position','relative');
		frame.css('overflow','hidden');


		// build a new element
		frame.append(  '<div class="' + arrow + '" id="' + arrowRight 	+ '" style="opacity:0.8;z-index:2;display:none;height:400px;width:100px;position:fixed;background:;top:0;right:0;"><!-- Right --></div>'
						+ '<div class="' + arrow + '" id="' + arrowLeft 	+ '" style="opacity:0.8;z-index:2;display:none;height:400px;width:100px;position:fixed;background:;top:0;left:0;"><!-- Left --></div>'
						+ '<div class="' + arrow + '" id="' + arrowBottom 	+ '" style="opacity:0.8;z-index:2;display:none;height:100px;width:400px;position:fixed;background:;bottom:0;left:0;"><!-- Bottom --></div>'
						+ '<div class="' + arrow + '" id="' + arrowTop 		+ '" style="opacity:0.8;z-index:2;display:none;height:100px;width:400px;position:fixed;background:;top:0;left:0;"><!-- Top --></div>');


		frame.mousemove(function(e){

			// DEFINE basic measure
			targetWidth = target.width(); // keseluruhan lebar dari target object
			targetHeight = target.height();
			frameWidth = frame.width(); // sudah termasuk lebar dari scroll vertical
			frameHeight = frame.height(); // sudah termasuk lebar dari scroll horizontal

			// cursor
			var cursor = {x:0, y:0};
			var cursorOverTarget = {x:0, y:0};
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
			cursorOverTarget.x = cursor.x - target.offset().left + deltaX;
			cursorOverTarget.y = cursor.y - target.offset().top + deltaY;

			// DYNAMIC DEFINE because of cursor
			$cursorPosition = cursor;
			$coordinat = cursorOverTarget;

			// DEFINE margin
			marginTop = frameHeight/5;
			marginRight = frameWidth/5;
			marginBottom = frameHeight/5;
			marginLeft = frameWidth/5;

			// DYNAMIC DEFINE because of scroll
			$scrollDistanceX = frame.scrollLeft();
			$scrollDistanceY = frame.scrollTop();
			$lengthFrameX = frameWidth + $scrollDistanceX;
			$lengthFrameY = frameHeight + $scrollDistanceY;
			$lengthTargetX = $lengthFrameX - deltaX;
			$lengthTargetY = $lengthFrameY - deltaY;
			$startMoveR = $lengthFrameX - marginRight;
			$startMoveL = ($lengthFrameX - frameWidth) + marginLeft;
			$startMoveT = ($lengthFrameY - frameHeight) + marginTop;
			$startMoveB = $lengthFrameY - marginBottom;

			// manipulate css
			// $('#' + arrowRight).css({'width': marginRight, 'left': frameWidth - marginRight + frame.offset().left, 'top': marginTop + frame.offset().top, 'height': frameHeight - (marginTop+marginBottom)});
			// $('#' + arrowLeft).css({'width': marginLeft, 'left': frame.offset().left, 'top': marginTop + frame.offset().top, 'height': frameHeight - (marginTop+marginBottom)});
			// $('#' + arrowBottom).css({'width': frameWidth - (marginLeft+marginRight), 'left': frame.offset().left+marginLeft, 'top': frameHeight - marginBottom + frame.offset().top, 'height': marginBottom});
			// $('#' + arrowTop).css({'width': frameWidth - (marginLeft+marginRight), 'left': frame.offset().left+marginLeft, 'top': frame.offset().top, 'height': marginTop});
			$('#' + arrowRight).css({'width': marginRight, 'left': frameWidth - marginRight + frame.offset().left, 'top': frame.offset().top, 'height': frameHeight});
			$('#' + arrowLeft).css({'width': marginLeft, 'left': frame.offset().left, 'top': frame.offset().top, 'height': frameHeight});
			$('#' + arrowBottom).css({'width': frameWidth, 'left': frame.offset().left, 'top': frameHeight - marginBottom + frame.offset().top, 'height': marginBottom});
			$('#' + arrowTop).css({'width': frameWidth, 'left': frame.offset().left, 'top': frame.offset().top, 'height': marginTop});

			// horizontal, scroll to right
			if(targetWidth == $lengthTargetX){
				if($('#' + arrowRight).css('display') != 'none') $('#' + arrowRight).hide();
			}
			if($coordinat.x > $startMoveR && targetWidth != $lengthTargetX) {
				$('#' + arrowRight).show();
			}
			// horizontal, scroll to left
			if($scrollDistanceX == 0){
				if($('#' + arrowLeft).css('display') != 'none') $('#' + arrowLeft).hide();
			}
			if($coordinat.x < $startMoveL && $scrollDistanceX != 0){
				$('#' + arrowLeft).show();
			}
			// vertical, scroll to bottom
			if(targetHeight == $lengthTargetY){
				if($('#' + arrowBottom).css('display') != 'none') $('#' + arrowBottom).hide();
			}
			if($coordinat.y > $startMoveB && targetHeight != $lengthTargetY) {
				$('#' + arrowBottom).show();
			}
			// vertical, scroll to top
			if($scrollDistanceY == 0){
				if($('#' + arrowTop).css('display') != 'none') $('#' + arrowTop).hide();
			}
			if($coordinat.y < $startMoveT && $scrollDistanceY != 0){
				$('#' + arrowTop).show();
			}


			// var a = '';
			// a+= 'x: ' + $cursorPosition.x + ',';
			// a+= 'y: ' + $cursorPosition.y + ';';
			// a+= 'eW: ' + targetWidth + ';';
			// a+= 'eH: ' + targetHeight + ';';
			// a += 'wW: ' + frameWidth + ';';
			// a += 'wH: ' + frameHeight + ';';
			// a += '$sDX: ' + $scrollDistanceX + ';';
			// a += '$sDY: ' + $scrollDistanceY + ';';
			// a += '$lengthFrameX: ' + $lengthFrameX + ';';
			// a += '$startMoveT: ' + $startMoveT + ';';
			// a += '$startMoveR: ' + $startMoveR + ';';
			// a += '$startMoveL: ' + $startMoveL + ';';
			// a += '$startMoveB: ' + $startMoveB + ';';
			// a += 'c.x: ' + $coordinat.x + ';';
			// a += 'c.y: ' + $coordinat.y + ';';
			// a += 'deltaX: ' + deltaX + ';';
			// a += '$lengthTargetX: ' + $lengthTargetX + ';';
			// a += '$lengthTargetY: ' + $lengthTargetY + ';';
			// ajaxMsg2(a);
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
				
				// set pointer
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
	
	// $('window').autoScroll($('#img'));
	$('#page').autoScroll($('#img-background'));
	// $('#img-background').autoScroll($('#img'));
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




});
