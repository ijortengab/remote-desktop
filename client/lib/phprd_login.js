$(document).ready(function(){
	if( $("#hidepassword").is(':checked') ) document.formlogin.client_action_password_value.type='password';	
	else document.formlogin.client_action_password_value.type='text';
	
	$("#hidepassword").click(function(){
		if( $(this).is(':checked')) document.formlogin.client_action_password_value.type='password';
		else document.formlogin.client_action_password_value.type='text';
	});
	
	function createCookie(name,value,days) {
	if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = escape(name)+"="+escape(value)+expires+"; path=/";
	}
	
	// alert($('.messages').html());
	if($('.messages').html() != ''){		
		$('.messages').hide();
		$('.messages').show('slow');
	}
	
	// sumber: http://api.jquery.com/jQuery.post/
	$("#formlogin").submit(function(event) {
	
		function PleaseWait() {	
			count++;
			if(count%4 == 1)			
			$('.messages').text('Please wait .');
			else if (count%4 == 2)
				$('.messages').text('Please wait . .');
			else if (count%4 == 3)
				$('.messages').text('Please wait . . .');				
			else if (count%4 == 0)
				$('.messages').text('Please wait ');
		}
		
		var count = 0;
		
		$('.messages').text('Please wait ');
		
		var timer = setInterval(function() { PleaseWait(count); }, 1000);
		
		$('#formlogin').fadeOut('slow');
		
		function phprd_process_login(data) {
			clearInterval(timer);
			$('.messages').empty().append(data.msg);
			$('.action').empty().append(data.act);
			if(data.id == 1){
			
				createCookie('phprd',data.extra,7);
				
				var count2 = 60;
				
				var prefix = data.msg + '. ';
				
				function CountDown() {	
					
					if(count2 === 0) {
						clearInterval(timer2);
						$('.messages').text('No response from server.');
						$('.action').text('Try Again.');
					} else {
						$('.messages').text(prefix + 'Waiting for response in ' + count2 + ' seconds.');
						count2--;
					}
				}
				
				var timer2 = setInterval(function() { CountDown(count2); }, 1000);
				
				location.reload()
			}
			
			
		}
		/* get some values from elements on the page: */
		var $form = $( this ),
			client_action = $form.find( 'input[name="client_action"]' ).val(),
			client_action_password_value = $form.find( 'input[name="client_action_password_value"]' ).val(),
			url = $form.attr( 'action' );

		/* Send the data using post and put the results in a div */
		$.post( url, { client_action: client_action, client_action_password_value: client_action_password_value }, function(data) {
			phprd_process_login(data)
		}, 'json'
		);

		/* stop form from submitting normally */
		event.preventDefault(); 
	});
	
	$(".action").click(function(){
		$('.messages').empty();
		$('.action').empty();
		$('#formlogin').fadeIn('slow');	
		event.preventDefault(); 
	});

	
});