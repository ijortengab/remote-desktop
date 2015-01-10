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
	
	$("#img").mousemove(function(e){

		var CoordinatWindowXY = getCoordinatWindow(e);
		var CoordinatX = CoordinatWindowXY[0] - this.offsetLeft;
		var CoordinatY = CoordinatWindowXY[1] - this.offsetTop;

		var entireWidth = $(this).width();
		var entireHeight = $(this).height();
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var marginTop = windowHeight/5;
		var marginRight = windowWidth/5;
		var marginBottom = windowHeight/5;
		var marginLeft = windowWidth/5;

		var $_scrollLeft = $(window).scrollLeft();
		var $_lengthR = windowWidth + $_scrollLeft;
		var $_startMoveR = $_lengthR - marginRight;
		
		var a = "";
		a+= CoordinatX + ',' + CoordinatY + ';';
		a+= marginTop + ',' + marginRight + ',' + marginRight + ',' + marginLeft + ';';
		a+= 'entireWidth: ' + entireWidth + ';';
		a+= 'entireHeight: ' + entireHeight + ';';
		a+= 'windowWidth: ' + windowWidth + ';';
		a+= 'windowHeight: ' + windowHeight + ';';
		a+= '$_lengthR: ' + $_lengthR + ';';
		a+= '$_startMoveR: ' + $_startMoveR + ';';
		ajaxMsg(a);

		if(CoordinatX > $_startMoveR && $_lengthR != entireWidth) {
			
			if($('#temporaryX').val().length == 0) $('#temporaryX').val($_startMoveR); // Simpan temporary value yang akan menjadi nilai perbandingan

			if(CoordinatX > $('#temporaryX').val()) { // Jika cursor semakin ke kanan, maka geser scroll ke kanan dan ubah cursor menjadi pointer

				if($('.arrow-right').css('display') != 'block') $('.arrow-right').css({'display':'block', 'width': marginRight}); // jalankan scroll ke kanan
				
				$('body').css({cursor:'pointer'}); // set cursor
				
				$('#temporaryX').val(CoordinatX); // sesuaikan kembali nilai temporary sebagai perbandingan

			}else{ //jika cursor semakin ke kiri maka stop scroll ke kanan.
				
				if($('.arrow-right').css('display') != 'none') $('.arrow-right').css('display','none'); // stop scroll
				
				$('#temporaryX').val(CoordinatX); // sesuaikan kembali nilai temporary sebagai perbandingan
				
				$('body').css({cursor:'default'});// set cursor
				
				
			}
		}
		
		else if($_lengthR == entireWidth){
			
			if($('.arrow-right').css('display') != 'none') $('.arrow-right').css('display','none'); // stop scroll
			
			$('body').css({cursor:'default'});// set cursor
			
		}

		//hapus temporary value
		if(CoordinatX < $_startMoveR){
			
			if($('.arrow-right').css('display') != 'none') $('.arrow-right').css('display','none'); // stop scroll
			
			if($('#temporaryX').val().length != 0) $('#temporaryX').val(''); //pastikan terhapus
			
			$('body').css({cursor:'default'});// set cursor
			
			
		}

		
	});

	$('.arrow-right').mousemove(function(e){
		var a = 'aku';
		a += e.pageX;
		ajaxMsg(a);
		var $runScroll = setInterval(function() {
			var $_scrollLeft = $(window).scrollLeft();
			$(window).scrollLeft($_scrollLeft+1);
		}, 40);
		
		$('.arrow-right').mouseleave(function(){
			clearInterval($runScroll);	
		});
	});
});
