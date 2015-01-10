(function($) {
// sumber: http://brandonaaron.net/code/mousewheel/demos
// mirror: http://www.github.com/brandonaaron/jquery-mousewheel/downloads
// diperbaiki pada attribut event oleh roji
// sumber: http://stackoverflow.com/questions/8886281/event-wheeldelta-returns-undefined?lq=1
// 18 April 2013
var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener )
            for ( var i=types.length; i; )
                this.addEventListener( types[--i], handler, false );
        else
            this.onmousewheel = handler;
    },

    teardown: function() {
        if ( this.removeEventListener )
            for ( var i=types.length; i; )
                this.removeEventListener( types[--i], handler, false );
        else
            this.onmousewheel = null;
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true;

    event = $.event.fix(event || window.event);
    event.type = "mousewheel";

	// roji ijor tengab ijortengab edited. 18 April 2013
    // if ( event.wheelDelta ) delta = event.wheelDelta/120;
    // if ( event.detail     ) delta = -event.detail/3;
	if ( event.originalEvent.wheelDelta ) delta = event.originalEvent.wheelDelta/120;
    if ( event.originalEvent.detail     ) delta = -event.originalEvent.detail/3;


    // Add event and delta to the front of the arguments
    args.unshift(event, delta);

    return $.event.handle.apply(this, args);
}

})(jQuery);


// http://
(function($) {
	$.fn.autoScrollMouseMove = function() {
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

		// function msgDebug(text, hide=null, delay=null){
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
		frame.append(  '<div class="' + arrow + '" id="' + arrowRight 	+ '" style="opacity:0.1;z-index:100;display:none;height:400px;width:100px;position:fixed;background:none;top:0;right:0;"><!-- Right --></div>'
						+ '<div class="' + arrow + '" id="' + arrowLeft 	+ '" style="opacity:0.1;z-index:100;display:none;height:400px;width:100px;position:fixed;background:none;top:0;left:0;"><!-- Left --></div>'
						+ '<div class="' + arrow + '" id="' + arrowBottom 	+ '" style="opacity:0.1;z-index:100;display:none;height:100px;width:400px;position:fixed;background:none;bottom:0;left:0;"><!-- Bottom --></div>'
						+ '<div class="' + arrow + '" id="' + arrowTop 		+ '" style="opacity:0.1;z-index:100;display:none;height:100px;width:400px;position:fixed;background:none;top:0;left:0;"><!-- Top --></div>');

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
			// msgDebug(debug);

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
			// msgDebug(debug);
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
	// var Drupal = {};
	// alert(Drupal.basePath);
	// alert(Webrd.settings.basePath);

	// var asldkfjasljfd = getSetting('webrd_smlc_x','left');
	// ajaxMsg(asldkfjasljfd);
	$('#img').mousewheel(function(event, delta) {
		ajaxMsg(delta);
	});

	////////////////////////
	// prepare
	////////////////////////

	$('#page').autoScrollMouseMove('target');
	var ww=window.innerWidth;
	var wh=window.innerHeight;
	$('#page').height(wh);
	// $('#layer').width(ww);
	// $('#layer').height(wh);
	// $('#layer-ada').width(ww);
	// $('#layer-ada').height(wh);

	effectSettingAll();


	////////////////////////
	// function
	////////////////////////

	function createCookie(name,value,days,basepath) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		if (basepath) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var path = "; path="+basepath;
		}
		else var path = "";
		document.cookie = name+"="+value+expires+path;
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

	function ajaxMsg(text){
		var id = ".ajax_msg";
		var left = $(window).width()/4;
		$(id).css({'left': left}).show().text(text);
	}

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

	function ajaxPost(url, variableForm, variableMsg){
		// time
		var date = new Date();
		var timeNow = date.getTime();
		// message
		if(variableMsg){
			var construct = '<div class="message" id="'+timeNow+'">'+'<span class="status">'+variableMsg.status+'</span>'+variableMsg.name+'</div>';
			$('#messages').append(construct);
		}
		// send
		$.post( url+'?'+timeNow, variableForm , function(data) {
			if(data.result == 1){
				if(variableMsg){
					objectId = $('#'+timeNow);
					objectId.find('span.status').text(data.messagestatus);
					objectId.delay(2500).fadeOut('slow',function(){$(this).remove()});
				}
			}
		}, 'json');
		// $.post( url+'?'+timeNow, variableForm);
	}

	function setSetting(name,value){
		// set cookie
		createCookie(name,value);
		// set messages
		var variableMsg = 	{
			status: 'sending',
			name: 'save settings'
		};
		// set variables post
		var variableForm = 	{
			client_action: 'save_setting',
			setName:name,
			setValue:value
			// webrd_smlc: $('#page_settings').find('input[name="webrd_smlc"]').prop('checked'),
			// webrd_smdc: $('#page_settings').find('input[name="webrd_smdc"]').prop('checked'),
			// webrd_smrc: $('#page_settings').find('input[name="webrd_smrc"]').prop('checked'),
			// webrd_smmc: $('#page_settings').find('input[name="webrd_smmc"]').prop('checked'),
			// webrd_smlc_x: $('#page_settings').find('select[name="webrd_smlc_x"]').val(),
			// webrd_smdc_x: $('#page_settings').find('select[name="webrd_smdc_x"]').val(),
			// webrd_smrc_x: $('#page_settings').find('select[name="webrd_smrc_x"]').val(),
			// webrd_smmc_x: $('#page_settings').find('select[name="webrd_smmc_x"]').val()
		};
		// post
		ajaxPost('', variableForm, variableMsg);
	}

	function getSetting(name, defaultValue){
		// cari di cookie karena itu nilai terbaru,
		// bila tidak ada, cari di object settings,
		// tidak ada juga, baru gunakan default
		var cookie = readCookie(name);
		if(cookie) return cookie;
		var defaultSettings =  Webrd.settings[name];
		if(defaultSettings) return defaultSettings;
		if(defaultValue) return defaultValue;
		return null;
	}

	function effectSetting(name){
		//set effect dikarenakan setting terhadap sesuatu.
		if(name == 'webrd_smlc') {
			$('#page_settings').find('input[name="webrd_smlc"]').prop('checked') ? $('#page_settings').find('select[name="webrd_smlc_x"]').removeAttr('disabled') : $('#page_settings').find('select[name="webrd_smlc_x"]').attr('disabled', 'disabled');
		}
		if(name == 'webrd_smdc') {
			$('#page_settings').find('input[name="webrd_smdc"]').prop('checked') ? $('#page_settings').find('select[name="webrd_smdc_x"]').removeAttr('disabled') : $('#page_settings').find('select[name="webrd_smdc_x"]').attr('disabled', 'disabled');
		}
		if(name == 'webrd_smrc') {
			$('#page_settings').find('input[name="webrd_smrc"]').prop('checked') ? $('#page_settings').find('select[name="webrd_smrc_x"]').removeAttr('disabled') : $('#page_settings').find('select[name="webrd_smrc_x"]').attr('disabled', 'disabled');
		}
		if(name == 'webrd_smmc') {
			$('#page_settings').find('input[name="webrd_smmc"]').prop('checked') ? $('#page_settings').find('select[name="webrd_smmc_x"]').removeAttr('disabled') : $('#page_settings').find('select[name="webrd_smmc_x"]').attr('disabled', 'disabled');
		}
	}

	function effectSettingAll(){
		effectSetting('webrd_smlc');
		effectSetting('webrd_smdc');
		effectSetting('webrd_smrc');
		effectSetting('webrd_smmc');
	}

	function dmouse(action,button,count){
		if(!count) count = 1;
		if(button == 'left'){
			var smlc = getSetting('webrd_smlc', '1');
			if(smlc == 0) return;
			var theX = getSetting('webrd_smlc_x', 'left');
			if(theX == 'double'){
				theX = 'left';
				count = 2;
			}
		}
		if(button == 'double'){
			var smdc = getSetting('webrd_smdc', '1');
			if(smdc == 0) return;
			var theX = getSetting('webrd_smdc_x', 'double');
			if(theX == 'double'){
				theX = 'left';
				count = 2;
			}
		}
		if(button == 'right'){
			var smrc = getSetting('webrd_smrc', '1');
			if(smrc == 0) return;
			var theX = getSetting('webrd_smrc_x', 'right');
			if(theX == 'double'){
				theX = 'left';
				count = 2;
			}
		}
		if(button == 'middle'){
			var smmc = getSetting('webrd_smmc', '1');
			if(smmc == 0) return;
			var theX = getSetting('webrd_smmc_x', 'right');
			if(theX == 'double'){
				theX = 'left';
				count = 2;
			}
		}

		var variableMsg = 	{
			status: 'sending',
			name: 'save settings'
		};
		
		var variableForm = 	{
			client_action: 'create_request',
			client_action_mouse_action:action,
			client_action_mouse_mode:'Screen',
			client_action_click_x:CoordinatX,
			client_action_click_y:CoordinatY,
			client_action_click_button:theX,
			client_action_click_count:count
		};
		
		ajaxPost('', variableForm, variableMsg);
		
		// $("#form_client").find( 'input[name="client_action_mouse_action"]' ).val(action);
		// $("#form_client").find( 'input[name="client_action_mouse_mode"]' ).val('Screen');
		// $("#form_client").find( 'input[name="client_action_click_x"]' ).val(CoordinatX);
		// $("#form_client").find( 'input[name="client_action_click_y"]' ).val(CoordinatY);
		// $("#form_client").find( 'input[name="client_action_click_button"]' ).val(theX);
		// $("#form_client").find( 'input[name="client_action_click_count"]' ).val(count);
		
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
				client_action_keystroke: $form.find( 'textarea[name="client_action_keystroke"]' ).val()
				};

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
	// click(function(){});
	////////////////////////

	// $("#img").click(function(){
		// var CoordinatWindowXY = getCoordinatWindow(arguments[0]);
		// var CoordinatX = CoordinatWindowXY[0] - this.offsetLeft + $("#page").scrollLeft();
		// var CoordinatY = CoordinatWindowXY[1] - this.offsetTop + $("#page").scrollTop();
		// $("#form_client").find( 'input[name="client_action_click_x"]' ).val(CoordinatX);
		// $("#form_client").find( 'input[name="client_action_click_y"]' ).val(CoordinatY);
		// $("#form_client").find( 'input[name="client_action_mouse_action"]' ).val('click');
		// $("#form_client").find( 'input[name="client_action_mouse_mode"]' ).val('Screen');
		// $("#form_client").find( 'input[name="client_action_click_button"]' ).val('left');
		// $("#form_client").find( 'input[name="client_action_click_count"]' ).val('1');
		// $("#form_client").submit();
	// });

	var DELAY = 250,
    clicks = 0,
    timer = null;
	mousedown = null;


	////////////////////////
	// HANDLE MOUSE EVENT
	////////////////////////

	$('#img').mousedown(function(e) {
		e.preventDefault();// ini digunakan utk mencegah klik default browser pada image. http://stackoverflow.com/questions/14008468/jquery-mouseup-not-being-fired-when-mousemove-on-image
		CoordinatWindowXY = getCoordinatWindow(arguments[0]);
		CoordinatX = CoordinatWindowXY[0] - this.offsetLeft + $("#page").scrollLeft();
		CoordinatY = CoordinatWindowXY[1] - this.offsetTop + $("#page").scrollTop();
		mousedown = true;
		clicks++;
	});

	$('#img').mouseup(function(e) {
		CoordinatWindowXY = getCoordinatWindow(arguments[0]);
		newCoordinatX = CoordinatWindowXY[0] - this.offsetLeft + $("#page").scrollLeft();
		newCoordinatY = CoordinatWindowXY[1] - this.offsetTop + $("#page").scrollTop();
		if(clicks === 1) {
			timer = setTimeout(function() {
				if(CoordinatX == newCoordinatX && CoordinatY == newCoordinatY){
					// PERFORM MOUSE SINGLE CLICK;
					if(e.which == 1) dmouse('click','left');
					if(e.which == 2) dmouse('click','middle');
					if(e.which == 3) dmouse('click','right');
				}
				else {
					// PERFORM MOUSE DRAG N DROP;
					if(e.which == 1) dmouse('drag','left');
					if(e.which == 2) dmouse('drag','middle');
					if(e.which == 3) dmouse('drag','right');
				}
				clicks = 0;
				clearTimeout(timer);
				mousedown = null;
			}, DELAY);
		} else {
			if(mousedown){
				// PERFORM MOUSE DOULE CLICK;
				if(e.which == 1) dmouse('click','double');
				if(e.which == 2) dmouse('click','middle','2');
				if(e.which == 3) dmouse('click','right','2');
			}
			clicks = 0;
			clearTimeout(timer);
			mousedown = null;

		}
		// ajaxMsg(e.which+'.');
	});

	$("#img").on("contextmenu",function(){
		var dsetting = getSetting('webrd_smrc');
		if(dsetting == 1) return false;
    });
	////////////////////////
	// NAVIGATION
	////////////////////////

	$("#nav_button_settings").click(function(){
		createCookie('A','asd','5');
		var page = '#page_settings';
		var navheight = $("#nav").height();
		var $height = $(window).height() - navheight;
		// var $width = $(window).width()/2;
		var $width =$(page).width();
		var $left = $(window).width()/4;
		var keystrokeShow = {left:'0'};
		var keystrokeHide = {left:'-' + $width +'px'};
		if($(page).css('display') == 'none'){
			$(page).css({	position:'fixed',
										width: $width + 'px',
										height: $height + 'px',
										bottom: '0px',
										left: '-' + $width +'px'}).show().animate(keystrokeShow, 300);
		}
		else{
			$(page).animate(keystrokeHide, 150, function(){
				$(page).hide()
			});
		}
	});


	////////////////////////
	// SETTINGS
	////////////////////////

	$(".settings_button").click(function(){
		$(this).each(function(){
			// var id = $(this).attr('id');
			var name = $(this).attr('name');
			$(this).prop('checked') ? setSetting(name, "1") : setSetting(name, "0");
			effectSetting(name);
		});
	});
	//$('.specific_character').change(function(){
	$(".settings_select").change(function(){
		$(this).each(function(){
			// var id = $(this).attr('id');
			var name = $(this).attr('name');
			var value = $(this).val();
			setSetting(name, value);
			effectSetting(name);
		});
	});



	////////////////////////
	// MISC
	////////////////////////


	$(".action").click(function(){
		$(this).each(function(){
			var id = $(this).attr('id');
			// alert(id);
			if(id == 'fixbar_button'){
				if($('#nav').css('position') != 'fixed'){
					$('#nav').css({'position':'fixed', 'width':'100%', 'top':'0'});
					$('#page').css({'margin-top':'34px'});
				}
				else{
					$('#nav').css({'position':'relative', 'width':'auto', 'top':'0'});
					$('#page').css({'margin-top':'0px'});
				};
			}
			if(id == 'reload_button'){
				$("#form_client").find( 'input[name="client_action_screenshot_reload"]' ).val('1');
				$("#form_client").submit();
			}
			if(id == 'keystroke_button'){
				var $height = $(window).height()/1.5;
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
			}
		});
	});

	$(".special_char_label").click(function(){
		$(this).each(function(){
			var attrfor = $(this).attr('for');
			if(attrfor == 'special_ctrl'){
				if($('#special_ctrl').prop('checked')) $(this).css('color','#999999');
				else $(this).css('color','#000000');
			}
			if(attrfor == 'special_shift'){
				if($('#special_shift').prop('checked')) $(this).css('color','#999999');
				else $(this).css('color','#000000');
			}
			if(attrfor == 'special_alt'){
				if($('#special_alt').prop('checked')) $(this).css('color','#999999');
				else $(this).css('color','#000000');
			}
		});
	});


	$("#k-send").click(function(){
		$("#form_client").submit();
	});

	////////////////////////
	// change(function(){});
	////////////////////////

	$('.specific_character').change(function(){

		//build the text
		var $value = $(this).val();
		if($('#special_alt').prop('checked')) $value = '{alt down}' + $value + '{alt up}';
		if($('#special_shift').prop('checked')) $value = '{shift down}' + $value + '{shift up}';
		if($('#special_ctrl').prop('checked')) $value = '{ctrl down}' + $value + '{ctrl up}';

		// set the text
		specialInsertToTextArea('#keystroke_input',$value);

		//clear current value
		$(this).val('none').attr('selected', 'selected');
		if($('#special_ctrl').prop('checked')) $('label[for="special_ctrl"]').click(); // berhubungan dengan $(".special_char_label").click(function(){});
		if($('#special_shift').prop('checked')) $('label[for="special_shift"]').click(); // berhubungan dengan $(".special_char_label").click(function(){});
		if($('#special_alt').prop('checked')) $('label[for="special_alt"]').click(); // berhubungan dengan $(".special_char_label").click(function(){});
	});

	////////////////////////
	// keydown(function(){});
	////////////////////////

	$(document).keydown(function(event){
		// event.preventDefault();
		// alert(event.keyCode);
		if(event.altKey && event.keyCode == 115){ //alt+f4
			alert('dimatikan');
		}
	});

});
