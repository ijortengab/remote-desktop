$(document).ready(function(){

	//click maka beri perintah untuk reload
	
	$("#form_client").submit(function(event) {
			// alert('a');
			
			var $form = $( this ),
			client_action = $form.find( 'input[name="client_action"]' ).val(),
			client_action_screenshot_reload = $form.find( 'input[name="client_action_screenshot_reload"]' ).val(),			
			url = $form.attr( 'action' );
			
			// alert(url);
			
			$.post( url, {
							client_action: client_action, 
							client_action_screenshot_reload: client_action_screenshot_reload
						 }, function(data) {
				if(data.id == 1){
					// alert(data.id);
					// $('#img').toggle('fast','swing');
					// $('#img').animate({
						// opacity: 500,
					// },1000);
					// $('#img').fadeIn("1000");
					$('.ajax_msg').text(data.msg);
					
					
					$('#hideimage').load(data.extra, function(){
						
						$("#img").css('background-image', 'url('+data.extra+')');	
						$("#img").animate({
							opacity: 1,
						},500);						
					});
					
					// $("#img").css('background-image', data.extra);
				}
				else{
					$('.ajax_msg').text(data.msg);
					$('#img').animate({
						opacity: 1,
					},500);
					
				}
				
				// location.reload()
			}, 'json'
			);

			event.preventDefault(); 
		});
	
	$("#img").click(function(){
		
		$(this).animate({
			opacity: 0.3,
		},500);
		
		$('.ajax_msg').text('Waiting...');
		$("#form_client").submit();
		
		// document.form_client.submit();
		// alert('oke');
		// if( $(this).is(':checked')) document.formlogin.client_action_password_value.type='password';
		// else document.formlogin.client_action_password_value.type='text';
	});
});