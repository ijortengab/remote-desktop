<?php

define('MAX_EXECUTION_TIME', ini_get('max_execution_time'));
define('MAX_LOOP_TIME', 3);
define('TIME', time());
define('GETCWD', getcwd());
define('DIRNAME_SCREENSHOT', 'screenshots');
define('DIRNAME_EXEC', 'exec');
define('DIRNAME_LOG', 'log');
define('PATH_FILE_SCREENSHOT', GETCWD . '/'. DIRNAME_SCREENSHOT .'/screenshot.' . TIME . '.jpg');
define('PATH_FILE_EXEC', GETCWD . '/'. DIRNAME_EXEC .'/exec.' . TIME . '.ahk');
define('PATH_FILE_LOG', GETCWD . '/'. DIRNAME_LOG .'/' . date("Y-m-d", TIME) . '.log');
define('CREATE_LOG', TRUE);

include('functions.php');

function write($file){
	global $data;
	switch($file){
		case "settings.ini":
			write_ini_file($data['settings'],"settings.ini");
			break;
	}
}



$result = 'NULL';

$data['settings'] = parse_ini_file("settings.ini");

// while(time() <= TIME + MAX_EXECUTION_TIME - 1){ // dikurangi 1 agar tidak terjadi timeout

	//membatasi agar aksi pembuatan screenshot ini hanya dilakukan minimal per satu detik
	//start
	$microtime_current = microtime_float();
	$time_current = time();
	if(!isset($microtime_save)){
		$microtime_save = $microtime_current;
	}
	elseif($microtime_current < $microtime_save+1 && $microtime_current != $microtime_save+1){
		usleep(250000);
		exit;
	}
	else{
		$microtime_save = $microtime_save+1;
	}
	//finish

	// create_log("test", $time_current);
	
	if(!isset($content)){
		$data['server_request']['variable']['server_action'] = 'read_client_request';
		$content = phprd_post();
	}

	if(!empty($content)){

		$data['client_request'] = unserialize($content);
		
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
		// do task
		foreach($task as $key => $value){
			if($key == 'send'){
				$contentfile = '';
				$contentfile .= "CoordMode, mouse, Screen\r\n";
				$value = implode('',$value);
				if(strlen($value) > 0){
					$contentfile .= "Send" . " " . $value;
					create_file(PATH_FILE_EXEC,"w",$contentfile);
					exec(PATH_FILE_EXEC);
				}	
			}
			if($key == 'setting_server'){
				foreach($value as $key2 => $value2){
					$data['settings'][$key2] = $value2;
				}
				write('settings.ini');
			}
		}
	}	
	//clean before loop
	unset($content);
// }
?>