<?php
// echo php_uname();
// echo PHP_OS;

// $a = is_64bit();
// var_dump($a);

// exit;
define('NAME', 'ssp');
define('MAX_LOOP_TIME', 3);
define('MODULUS', 0);
define('TIME', time());
define('GETCWD', getcwd());
define('DIRNAME_SCREENSHOT', 'screenshots');
define('DIRNAME_LOG', 'log');
define('DIRNAME_LIB', 'lib');
define('PATH_FILE_LOG', GETCWD . '/'. DIRNAME_LOG .'/' . date("Y-m-d", TIME) . '.log');
define('PATH_FILE_SCREENSHOT_TMP', GETCWD . '/'. DIRNAME_LIB .'/' .  'tmp.png');
define('PATH_FILE_SCREENSHOT_AHK', GETCWD . '/'. DIRNAME_LIB .'/' .  'screenshot.ahk');
define('CREATE_LOG', TRUE);

include('functions.php');

// function is_64bit(){
	// $agent = $_SERVER['HTTP_USER_AGENT'];
	// $result = preg_match('/WOW64/',$agent);
	// if($result === 1) return TRUE;
	// $result = preg_match('/x64/',$agent);
	// if($result === 1) return TRUE;
	// $result = preg_match('/Win64/',$agent);
	// if($result === 1) return TRUE;
	// return false;
// }
function create_screenshot(){
	exec(PATH_FILE_SCREENSHOT_AHK);
}
function is_same_screenshot(){
	$scandir = scandir(DIRNAME_SCREENSHOT);
	$scandir_filtered = array();
	foreach($scandir as $filename){
		if(preg_match('/png/i',$filename)){
			$scandir_filtered[] = $filename;
		}
	}
	$scandir = $scandir_filtered;
	$z = array_pop($scandir);
	$z_date = filemtime(DIRNAME_SCREENSHOT . '/' . $z);
	$z_size = filesize(DIRNAME_SCREENSHOT . '/' . $z);
	$y = array_pop($scandir);
	$y_date = filemtime(DIRNAME_SCREENSHOT . '/' . $y);
	$y_size = filesize(DIRNAME_SCREENSHOT . '/' . $y);
	return ($y_size == $z_size) ? TRUE : FALSE;
}
function delete_the_last_screenshot(&$contextmsg){
	$scandir = scandir(DIRNAME_SCREENSHOT);
	$scandir = scandir(DIRNAME_SCREENSHOT);
	$scandir_filtered = array();
	foreach($scandir as $filename){
		if(preg_match('/png/i',$filename)){
			$scandir_filtered[] = $filename;
		}
	}
	$scandir = $scandir_filtered;
	$z = array_pop($scandir);
	$path = DIRNAME_SCREENSHOT . '/' . $z;
	unlink($path);
	$contextmsg = $z;
}
function get_the_last_screenshot(&$contextmsg){
	$scandir = scandir(DIRNAME_SCREENSHOT);
	$z = array_pop($scandir);
	$path = DIRNAME_SCREENSHOT . '/' . $z;
	$contextmsg = $z;
}

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
	
	// read settings
	$data['settings'] = parse_ini_file("settings.ini");
	if(!isset($data['settings']['webrd_ss_auto'])) exit;
	if(isset($data['settings']['webrd_ss_auto']) && $data['settings']['webrd_ss_auto'] == 0) exit;

	// make screenshot
	create_log('Prepare to make screenshot.',$time_current);
	create_screenshot();		
	if(!file_exists_loop(PATH_FILE_SCREENSHOT_TMP,MAX_LOOP_TIME)){
		create_log('Failed produce screenshot.',$time_current);
		exit;
	}
	else{		
		create_log('Screenshot created.', $time_current);
		$filename_screenshot = $microtime_current . '.png';
		$path_file_screenshot = GETCWD . '/'. DIRNAME_SCREENSHOT .'/' . $filename_screenshot;
		rename(PATH_FILE_SCREENSHOT_TMP,$path_file_screenshot);
		create_log('Screenshot renamed: ' .$filename_screenshot,$time_current);
	}
	if(is_same_screenshot()){
		create_log('Current screenshot detected same than before.',$time_current);
		delete_the_last_screenshot($msg);
		create_log('Deleted Screenshot: ' . $msg , $time_current);
		// exit;
	}
	else{
		//send screenshot
		create_log('Prepare to send screenshot: ' . $filename_screenshot , $time_current);
		$data['server_request']['variable']['server_result'] = TRUE;
		$data['server_request']['file']['server_screenshot'] = $path_file_screenshot;
		// get_the_last_screenshot($msg);
		$data['server_request']['variable']['server_action'] = 'server_confirm';
		$result = phprd_post();
		create_log($result,$time_current);
		create_log('Screenshot was sent: ' . $filename_screenshot,$time_current); 
	}
	
// }
create_log('------------------------------------',$time_current);
// $sldfjafjlas = scandir(DIRNAME_SCREENSHOT);
// create_log(print_r($sldfjafjlas, true) , $time_current);
?>