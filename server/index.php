<?php
// phpinfo();exit;


echo '<pre>';
include('functions.php');

define('MAX_LOOP_TIME', 20);
define('TIME', time());
define('GETCWD', getcwd());
define('DIRNAME_SCREENSHOT', 'screenshots');
define('DIRNAME_EXEC', 'exec');
define('PATH_FILE_SCREENSHOT', GETCWD . '/'. DIRNAME_SCREENSHOT .'/screenshot.' . TIME . '.jpg');
define('PATH_FILE_EXEC', GETCWD . '/'. DIRNAME_EXEC .'/exec.ahk');

// echo is_same_screenshot() ? "sama":"g sama";
// exit;

function write($file){
	global $data;
	switch($file){
		case "settings.ini":
			write_ini_file($data['settings'],"settings.ini");
			break;
	}
}

$result = 'NULL';
if(!file_exists('settings.ini')){
	$array = array(
		'password' => md5('a'),
		'client' => 'http://localhost/project/phpremotedesktop/client/index.php',
	);
	write_ini_file($array,'settings.ini');
}

$data['settings'] = parse_ini_file("settings.ini");
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
	
	echo '$data => ';
	print_r($data);
	echo "\r\n";

	// prepare to set task
	$task = array();
	foreach($data['client_request'] as $key => $value){
		if(isset($data['client_request'][$key]['client_action_keystroke'])){
			$text = $data['client_request'][$key]['client_action_keystroke'];
			translate($text);
			$task['send'][] = $text;
		}
		if(	isset($data['client_request'][$key]['client_action_setting_server_name']) &&
			isset($data['client_request'][$key]['client_action_setting_server_value']) ){
			$name_setting = $data['client_request'][$key]['client_action_setting_server_name'];
			$value_setting = $data['client_request'][$key]['client_action_setting_server_value'];
			$task['setting_server'][$name_setting] = $value_setting;
		}
	}

	echo '$task => ';
	print_r($task);
	echo "\r\n";

	// do task
	foreach($task as $key => $value){
		if($key == 'send'){
			$contentfile = '';
			$contentfile .= "CoordMode, mouse, Screen\r\n";
			$contentfile .= "Send" . " " . implode('',$value);
			// echo $contentfile;
			backup_file_if_exists(PATH_FILE_EXEC);
			create_file(PATH_FILE_EXEC,"w",$contentfile);
			exec(PATH_FILE_EXEC);
		}
		if($key == 'setting_server'){
			foreach($value as $key2 => $value2){
				$data['settings'][$key2] = $value2;
			}			
			write('settings.ini');
		}
	}

	echo '$data[settings] => ';
	print_r($data['settings']);
	echo "\r\n";	
	
}

// do all in settings

if(isset($data['settings']['webrd_ss_auto']) && $data['settings']['webrd_ss_auto'] == 1){
	backup_file_if_exists(PATH_FILE_SCREENSHOT);
	create_screenshot();
	if(!file_exists_loop(PATH_FILE_SCREENSHOT,MAX_LOOP_TIME)){
		$data['server_request']['variable']['server_result'] = FALSE;
	}
	elseif(is_same_screenshot()){
		$data['server_request']['variable']['server_result'] = FALSE;
		// $fopen = fopen(TIME,'w');
		// fclose($fopen);
	}
	else {
		// input type file
		$data['server_request']['variable']['server_result'] = TRUE;
		$data['server_request']['file']['server_screenshot'] = PATH_FILE_SCREENSHOT;
	}
	$data['server_request']['variable']['server_action'] = 'write_confirm';
	$result = phprd_post();
}

/* exit;
	
	
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
$result = phprd_post(); */




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

function is_same_screenshot(){
	// echo 'mantab';
	$scandir = scandir(DIRNAME_SCREENSHOT);	
	// print_r($scandir);
	$z = array_pop($scandir);
	$z_date = filemtime(DIRNAME_SCREENSHOT . '/' . $z);
	$z_size = filesize(DIRNAME_SCREENSHOT . '/' . $z);
	$y = array_pop($scandir);
	$y_date = filemtime(DIRNAME_SCREENSHOT . '/' . $y);
	$y_size = filesize(DIRNAME_SCREENSHOT . '/' . $y);
	
	return ($y_size == $z_size) ? TRUE : FALSE;
	// if($y_size == $z_size) return TRUE;
	// else
	// echo $z;
	// echo "\r\n";
	// echo $z_date;
	// echo "\r\n";
	// echo $z_size;
	// echo "\r\n";
	// echo $y;
	// echo "\r\n";
	// echo $y_date;
	// echo "\r\n";
	// echo $y_size;
	
	
}
?>