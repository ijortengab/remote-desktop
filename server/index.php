<?php
echo '<pre>';
include('functions.php');

define(MAX_LOOP_TIME, 20);
define(DIRNAME_SCREENSHOT, 'screenshots');
define(DIRNAME_EXEC, 'exec');
define(PATH_FILE_SCREENSHOT, getcwd() . '/'. DIRNAME_SCREENSHOT .'/screenshot.jpg');
define(PATH_FILE_EXEC, getcwd() . '/'. DIRNAME_EXEC .'/exec.ahk');


$result = 'NULL';
if(!file_exists('settings.ini')){
	$array = array(
		'password' => md5('a'),	
		'client' => 'http://localhost/project/phpremotedesktop/client/index.php',		
	);
	write_ini_file($array,'settings.ini');
}

$data['setting'] = parse_ini_file("settings.ini");
$data['server_request']['variable']['server_action'] = 'read_client_request';

$content = phprd_post();

echo '$data => ';
print_r($data);
echo "\r\n";

echo '$content => ';
print_r($content);
echo "\r\n";

if(!empty($content)){

	$data['client_request'] = unserialize($content);
	
	// Execute Client Request
	
	if(!empty($data['client_request']['mouse']['action'])){
		$action = $data['client_request']['mouse']['action'];
		$mode = $data['client_request']['mouse']['mode'];
		$x = $data['client_request']['click']['x'];
		$y = $data['client_request']['click']['y'];
		$button = $data['client_request']['click']['button'];
		$count = $data['client_request']['click']['count'];
		$contentfile= '';
		switch($action){
			case 'click':
				$contentfile .= "CoordMode, mouse, " . $mode ."\r\n";
				$contentfile .= "MouseClick, " . $button . ", " . $x . ", " . $y . ", " . $count;
				break;
		}
		backup_file_if_exists(PATH_FILE_EXEC);
		create_file(PATH_FILE_EXEC,"w",$contentfile);
		exec(PATH_FILE_EXEC);
	}
	
	if(!empty($data['client_request']['keystroke']['value'])){		
		$keystroke_value = $data['client_request']['keystroke']['value'];
		$contentfile = "Send". " " . $keystroke_value;
		backup_file_if_exists(PATH_FILE_EXEC);
		create_file(PATH_FILE_EXEC,"w",$contentfile);
		exec(PATH_FILE_EXEC);		
	}
	
	if(!empty($data['client_request']['screenshot']['reload'])){
		backup_file_if_exists(PATH_FILE_SCREENSHOT);
		create_screenshot();		
		if(!file_exists_loop(PATH_FILE_SCREENSHOT,MAX_LOOP_TIME)){
			$data['server_request']['variable']['server_result'] = FALSE;
		}				
		else {
			// input type file
			$data['server_request']['variable']['server_result'] = TRUE;
			$data['server_request']['file']['server_screenshot'] = PATH_FILE_SCREENSHOT;
		}
	}

	$data['server_request']['variable']['server_action'] = 'write_confirm';
	$result = phprd_post();
}



echo '$data => ';
print_r($data);
echo "\r\n";

echo '$result => ';
print_r($result);
echo "\r\n";


echo '</pre>';

function create_screenshot(){
	if(!file_exists(DIRNAME_SCREENSHOT)) mkdir(DIRNAME_SCREENSHOT,0755,TRUE);	
	$im = imagegrabscreen();
	imagejpeg($im, PATH_FILE_SCREENSHOT, 100);
	imagedestroy($im);
}
?>