$(document).ready(function(){
	if( $("#hidepassword").is(':checked') ){
		document.formlogin.client_action_password_value.type='password';
	}
	else{
		document.formlogin.client_action_password_value.type='text';
	}
	
	$("#hidepassword").click( function(){
	   if( $(this).is(':checked') ){
			document.formlogin.client_action_password_value.type='password';			
	   }
		else {
			document.formlogin.client_action_password_value.type='text';
		}
	});

	$('#submit').click(function () {
         
        var name = $('input[name=client_action_password_value]');
		 
		//http://stackoverflow.com/questions/5606600/simple-3-2-1-countdown-in-javascript-jquery
		function endCountdown() {		
			$('#submit').removeAttr('disabled');
			$('#submit').val('Connect');	
			$('#client_action_password_value').removeAttr('disabled');
			$('#client_action_password_value').val('');
			$('.loading').hide();
		}
		
		function handleTimer() {
			if(count === 0) {
				clearInterval(timer);
				endCountdown();
			} else {
				// $('#count_num').html(count);
				$('#wait').text('Please wait in ' + count + ' seconds.');
				count--;
			}
		}
		
		var count = 60;
		
		$('#submit').attr('disabled','true');
		
		// $('#submit').hide();
		
		$('#client_action_password_value').attr('disabled','true');
		
		$('#wait').text('Please wait in ' + count + ' seconds.');
		
		count--;
		
		var timer = setInterval(function() { handleTimer(count); }, 1000);

        var data = 'name=' + name.val() + '&has_js=1';
		
		$('#submit').attr('disabled','true');
		
		// $('#submit').val('Please Wait...');

		$('.loading').show();
		
		//start the ajax
		$.ajax({
			//this is the php file that processes the data and send mail
			url: "process.php",
			 
			//GET method is used
			type: "GET",

			//pass the data        
			data: data,    
			 
			//Do not cache the page
			cache: false,
			 
			//success
			success: function (html) {             
				//if process.php returned 1/true (send mail success)
				
				// parse json 
				var obj = jQuery.parseJSON(html);
				
				if (obj.id == 1) {
				
					$('.messages').hide();  
					
					$('.messages').text(obj.msg);
					
					//hide the form
					$('#formlogin').fadeOut('slow');                
					 
					//show the success message
					$('.messages').fadeIn('slow');
					 
				//if process.php returned 0/false (send mail failed)
				} else alert(obj.msg);              
			}
		});
        //cancel the submit button default behaviours
		
        return false;
    
	}); 
	
});