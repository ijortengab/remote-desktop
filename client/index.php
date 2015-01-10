<?php
// *message
// [ v ] Show Message
// [   ] Display Status
// [   ] Display Action Name
// [   ] Display Detail
// [   ] Display Hour
// sleep(5);
/*--------------------------------------------------
 | PHP REMOTE DESKTOP
 +--------------------------------------------------
 | phpremotedesktop 0.2
 | By Ijor Tengab
 | Copyright (c) 2012 Ijor Tengab
 | E-mail: m_roji28@yahoo.com
 | URL: http://build.web.id/project/phpremotedesktop
 | Last Changed: 2012-12-09
 +--------------------------------------------------
*/
// pe er. buat pake  imagecreatetruecolor(). jika ada gambar yanggak ada di screenshot.
/*
  LIST VARIABLE
  $data                        = (array) tempat semua data tersimpan.
  $data['settings']             = (array) data dari file settings.ini, berisi konfigurasi dan database
  $data['settings']['password'] = (string) password untuk mengakses file ini.
  $data['settings']['msg']      = (string) pesan untuk disampaikan kepada user
  $data['settings']['key_save_limit']	= (integer) maksimal jumlah baris data yang disimpan.
  $data['webrd']               = (string) data cookie berisi session yang didapat oleh user
  $data['client_action']       = (string) tindakan yang dilakukan oleh user
  $data['client_request']      = (array) data untuk ditulis di file client_request.ini dibaca oleh server
  $data['server_action']       = (string)berisi POST yang diinginkan oleh server
  $data['server_request']      = (array) data untuk ditulis di file client_request
 */
// if(!isset($_GET['a'])){
	// sleep(5);
// }
// $a = parse_ini_file("client_request.ini");
// print_r($a);

define('GETCWD', getcwd());
define('MAX_LOOP_TIME', 3);
define('TIME', time());
define('DIRNAME_SCREENSHOT', 'screenshots');
define('PATH_FILE_SCREENSHOT', GETCWD . '/'. DIRNAME_SCREENSHOT .'/screenshot.' . TIME . '.jpg');
define('PATH_FILE_SAVE', GETCWD . '/save.txt');
header("Pragma: no-cache");
header("Cache-Control: no-store");
foreach ($_GET as $key => $val) $data[$key]=$val;
foreach ($_POST as $key => $val) $data[$key]=$val;
foreach ($_COOKIE as $key => $val) $data[$key]=$val;
foreach ($_FILES as $key => $val) $data[$key]=$val;
include('functions.php');

if(!file_exists('settings.ini')){
	$array = array(
		'password' => md5('a'),
		'key_save_limit' => 5,
		'webrd_smlc' => "1",
		'webrd_smdc' => "1",
		'webrd_smrc' => "1",
		'webrd_smmc' => "1",
		'webrd_smlc_x' => "lc",
		'webrd_smdc_x' => "dc",
		'webrd_smrc_x' => "rc",
		'webrd_smmc_x' => "mc",
	);
	write_ini_file($array,'settings.ini');
}
$data['settings'] = parse_ini_file("settings.ini");



//jika ada masalah dengan settings.ini saat proses, maka hilangkan dan bikin baru.
if(empty($data['settings'])){
	unlink('settings.ini');
	header('Location: '. this_file());
}
if(empty($data['settings']['password'])){
	unlink('settings.ini');
	header('Location: '. this_file());
}
// print_r($data['settings']);
// exit;
$loggedon = '';
$auth_pass ='a';
// authenticated user
if(isset($data['webrd']) && $data['webrd'] == $data['settings']['password']){
	if(!isset($data['client_action'])) $data['client_action'] = '';
	switch($data['client_action']){
		case 'logout': process('logout'); break;
		case 'create_request': process('create_request'); break;
		case 'setting_client': process('setting_client'); break;
		case 'load_new_screenshot': process('load_new_screenshot'); break;
		default: process();
	}
}
// anonymous user
else{
    if(isset($data['client_action'])){
		switch($data['client_action']){
			case 'login': process('login'); break;
			default: draw('form_login');
		}
	}
	elseif(isset($data['server_action'])){
		switch($data['server_action']){
			case 'read_client_request': read('client_request.ini'); break;
			case 'write_confirm': write('.confirm'); break;
			case 'server_confirm': process('server_confirm'); break;
			default: draw('form_login');
		}
	}
    else draw('form_login');
}
function read($file){
	global $data;
	switch($file){
		case "client_request.ini":			
			$scandir = scandir(GETCWD);
			$all = array();
			foreach($scandir as $file){
				$pola = '/^client_request\.(.*)\.ini/';
				if(preg_match($pola, $file, $matches)){
					$time = $matches[1];
					$array = parse_ini_file($file);
					unlink($file);
					$all[$time] = $array;
				}
			}
			if(!empty($all)) print serialize($all);
			break;
	}
}
function write($file){
	global $data;
	switch($file){
		case ".confirm":
			if(isset($data['server_screenshot'])){
				backup_file_if_exists(PATH_FILE_SCREENSHOT);
				$move = move_uploaded_file($data['server_screenshot']['tmp_name'], PATH_FILE_SCREENSHOT);
				// beri log jika move gagal
				if(file_exists(PATH_FILE_SCREENSHOT)){
					$date = filemtime(PATH_FILE_SCREENSHOT);
					$new_name = dirname(PATH_FILE_SCREENSHOT) . "/" . pathinfo(PATH_FILE_SCREENSHOT, PATHINFO_FILENAME) . "_" . $date . "." . pathinfo(PATH_FILE_SCREENSHOT, PATHINFO_EXTENSION);
					rename(PATH_FILE_SCREENSHOT, $new_name);
				}
			}
			create_file(".confirm",'w','');
			break;
		case "client_request.ini":
			$time = time();
			write_ini_file($data['client_request'],"client_request.".$time.".ini");
			break;
		case "settings.ini":
			write_ini_file($data['settings'],"settings.ini");
			break;
	}
}
function process($action=NULL){
	global $data;
	switch($action){
		case 'logout':
			setcookie("webrd", "", 0, '/'); //jika tidak ada path, maka menghilangkan cookie akan gagal
			$data['settings']['msg'] = "Anda berhasil logout";
			write('settings.ini');
			header('Location: '. this_file());
			break;
		case 'login':
			// sleep(2);// sementara
			if($data['settings']['password'] == md5($data['client_action_password_value'])){
				$data['client_request']['client_action_screenshot_reload'] = TRUE;
				write('client_request.ini');
				$extra = md5($data['client_action_password_value']);				
				echo json_encode(array("id" => 1, "msg" => "Login Success", "act" => "", "extra" => $extra));
			}
			else{
				echo json_encode(array("id" => 0, "msg" => "Login Failed", "act" => "Try Again"));
			}
			break;
		case 'create_request':
			// CREATE FILE COMMAND
			// screenshot
			if(isset($data['client_action_screenshot_reload'])) $data['client_request']['client_action_screenshot_reload'] = $data['client_action_screenshot_reload'];
			// send input
			if(isset($data['client_action_keystroke'])) $data['client_request']['client_action_keystroke'] = $data['client_action_keystroke'];
			// setting server
			if(isset($data['client_action_setting_server_name'])) $data['client_request']['client_action_setting_server_name'] = $data['client_action_setting_server_name'];
			if(isset($data['client_action_setting_server_value'])) $data['client_request']['client_action_setting_server_value'] = $data['client_action_setting_server_value'];		

			write('client_request.ini');			
			break;
		case 'setting_client':
			$name = $data['client_action_setting_client_name'];
			$value = $data['client_action_setting_client_value'];			
			$data['settings'][$name] = $value;
			write('settings.ini');
			echo json_encode(array('result'=> 1, 'messagestatus'=>'saved'));
			break;
		case 'load_new_screenshot':
			load_new_screenshot();
			break;
		case 'server_confirm':
			if(isset($data['server_screenshot'])){
				$path_file_screenshot = DIRNAME_SCREENSHOT . '/' . $data['server_screenshot']['name'];				
				$move = move_uploaded_file($data['server_screenshot']['tmp_name'], $path_file_screenshot);
				if($move) echo "file berhasil kami terima dengan baik.";
				else echo "file gagl kami terima.";
			}
			break;
		default:
			if(file_exists("client_request.ini")) {
				if(!file_exists_loop(".confirm",20)){
					delete_if_exists('client_request.ini');
					delete_if_exists('.confirm');
					setcookie("webrd", "", 0, '/'); //jika tidak ada path, maka menghilangkan cookie akan gagal
					$data['settings']['msg'] = "tidak ada respon dari server";
					write('settings.ini');
					$redirect = TRUE;
				}
			}
			if(isset($redirect) && $redirect){
				unset($redirect);
				header('Location: '. this_file());
			}
			else{
				delete_if_exists('client_request.ini');
				delete_if_exists('.confirm');
				draw();
			}
	}
}
function the_last_screenshot(){
	if(!file_exists(DIRNAME_SCREENSHOT)) mkdir(DIRNAME_SCREENSHOT,0755,TRUE);
	$list = scandir(DIRNAME_SCREENSHOT);
	if(count($list) == 2){ //it means Array ( [0] => . [1] => .. )
		// create sample image
		$im = imagecreatetruecolor(600, 400);
		$text_color = imagecolorallocate($im, 255, 255, 255);
		imagestring($im, 5, 200, 100,  'Screenshot not found', $text_color);
		imagejpeg($im, DIRNAME_SCREENSHOT . '/'.time().'.jpg');
		imagedestroy($im);
		// replay
		$list = scandir(DIRNAME_SCREENSHOT);
	}
	$the_last_screenshot = array_pop($list);
	$screenshot = DIRNAME_SCREENSHOT . '/'. $the_last_screenshot;
	return $screenshot;
}
function load_new_screenshot(){
	global $data;
	if(!file_exists(DIRNAME_SCREENSHOT)) mkdir(DIRNAME_SCREENSHOT,0755,TRUE);
	$list = scandir(DIRNAME_SCREENSHOT);
	if(count($list) == 2){ //it means Array ( [0] => . [1] => .. )
		// create sample image
		$im = imagecreatetruecolor(600, 400);
		$text_color = imagecolorallocate($im, 255, 255, 255);
		imagestring($im, 5, 200, 100,  'Screenshot not found', $text_color);
		imagejpeg($im, DIRNAME_SCREENSHOT . '/'.time().'.jpg');
		imagedestroy($im);
		// replay
		$list = scandir(DIRNAME_SCREENSHOT);
	}
	$the_last_screenshot = array_pop($list);
	$the_last_screenshot = DIRNAME_SCREENSHOT . '/'. $the_last_screenshot;

	if(isset($data['settings']['screenshot']) && $data['settings']['screenshot'] == $the_last_screenshot){
		echo json_encode(array("result" => 0));
	}
	else{
		$data['settings']['screenshot'] = $the_last_screenshot;
		write('settings.ini');
		$size = getimagesize($the_last_screenshot);
		$width = $size[0];
		$height = $size[1];
		echo json_encode(array("result" => 1, "msg" => "", "screenshot" => $the_last_screenshot, "width" => $width, "height" => $height));
	}

}
function draw($theme=NULL){
	global $data;
	$screenshot = the_last_screenshot();
	$size = getimagesize($screenshot);
	$width = $size[0];
	$height = $size[1];
	switch($theme){
		case 'form_login':
			$msg = '';
			if(isset($data['settings']['msg'])){
				$msg = $data['settings']['msg'];
				$data['settings']['msg'] = "";
				write('settings.ini');
			}
			$html ='<!DOCTYPE html>';
			$html .='<html>';
			$html .='<head>';
			$html .='<title>';
			$html .='PHP Remote Desktop';
			$html .='</title>';
			$html .='<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$html .='<link rel="stylesheet" href="lib/style.css" type="text/css">';
			$html .='<script src="lib/jquery.min.js?v=1.8.3"></script>';
			$html .='<script src="lib/webrd_login.js"></script>';
			$html .='</head>';
			$html .='';
			$html .='<body>';
			$html .='<div class="page">';
			$html .='<h1><a title="Go to Project Homepage" class="h1" href="http://build.web.id/project/phpremotedesktop">PHP Remote Desktop</a></h1>';
			$html .='<div class="subtitle">2012, version 0.2</div>';
			$html .='<hr>';
			$html .='<br>';
			$html .='<div class="messages">'. $msg .'</div>';
			$html .='<a href="#" class="action"></a>';
			$html .='<form action="" method="post" name="formlogin" id="formlogin">';
			$html .='<input placeholder="Type Password" type="password" id="client_action_password_value" name="client_action_password_value">';
			$html .='<input type="text" name="client_action" value="login">';
			$html .='<input type="submit" id="submit" value="Connect">';
			$html .='<div class="loading"></div>';
			$html .='<span id="wait"></span>';
			$html .='<div class="hidepassword"><input type="checkbox" value="" id="hidepassword" name="hidepassword"><label for="hidepassword">Hide Password</label></div>';
			$html .='</form>';
			$html .='</div>';
			$html .='</body>';
			$html .='</html>';
			echo $html;
			break;
		default:
			// hapus settingan di cookie
			// buat settingan di object javascript
			$extend = array();
			//default value disini
			foreach($data['settings'] as $key => $value){
				if(substr($key, 0, 6) == 'webrd_'){
					setcookie($key, '', -1);//hapus cookie
					$extend[$key] = $value;
				}
			}
			$extend =  json_encode($extend);
			echo '<!DOCTYPE html>';
			echo '<html>';
			echo '<head>';
			echo '<title>';
			echo 'PHP Remote Desktop';
			echo '</title>';
			echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			echo '<link rel="stylesheet" href="lib/style.css" type="text/css">';
			echo '<script src="lib/jquery.min.js?v=1.8.3"></script>';
			// echo "<script>var Webrd = { 'settings': {}};</script>";
			echo "<script>var Webrd = { 'settings': ".$extend."};</script>";
			echo '<script src="lib/webrd_basic.js"></script>';
			echo '<script src="lib/webrd_object.js"></script>';
			echo '</head>';
			echo '<body>';
			echo '<div id="page">';
			echo '<div id="nav">';
			echo '<ul class="links">';
			echo '<li>';
			echo '<a class="action" id="fixbar_button">';
			echo 'FIX';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a class="action" id="reload_button">';
			echo 'Reload';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a class="action" id="keystroke_button">';
			echo 'Keystroke';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a class="action" id="nav_button_settings">';
			echo 'Settings';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a href="index.php?client_action=logout">';
			echo 'Log Out';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a>';
			echo 'Help';
			echo '</a>';
			echo '</li>';
			echo '</ul><!-- /.links -->';
			// echo 'Reload | Keystroke | Settings | <a href="index.php?client_action=logout">Log Out</a> | Help ';
			echo '</div><!--/#nav -->';
			// echo '<div id="scrolling" style="width:'.$width.'px;height:3000px;overflow:scroll;">';
			echo '<div id="img-background" style="width:'.$width.'px;height:'.$height.'px;background:url('.$screenshot.');">';
			// echo '<div id="img-disabled" style="width:'.$width.'px;height:'.$height.'px;background:url('.$screenshot.');">';
			echo '<div id="img" style="width:'.$width.'px;height:'.$height.'px;background:url('.$screenshot.');">';
			// echo '<img id="img" src="screenshot/'.$the_last_screenshot.'">';
			echo '</div><!--/#img -->';
			// echo '</div><!--/#img-disabled -->';
			echo '</div><!--/#img-background -->';
			// echo '</div><!--/#scrolling -->';
			echo '</div><!--/#page -->';
			// echo '<script type="text/javascript">';
			// echo 'writemenu();';
			// echo '</script>';

			echo '<div id="page_settings">';
			$mouse_array = array('lc' => 'click','dc' => 'double click', 'rc' => 'rightclick', 'mc' => 'middleclick');
			echo '#mouse click'; echo '<br>';
			echo '<ul>';
			foreach($mouse_array as $key => $value){
				$var_check = 'webrd_sm' . $key;
				$var_select = 'webrd_sm' . $key . '_x';
				$checked = (isset($data['settings'][$var_check]) && $data['settings'][$var_check] == "1") ? " checked" : "";
				echo '<li>';
				echo '<input type="checkbox" id="sm'.$key.'" class="settings_checkbox" name="webrd_sm'.$key.'" title="settings mouse '.$value.'" value="1"'.$checked.'>';
				echo '<label for="sm'.$key.'">if I '.$value.', it means server do </label>';
				echo '<select class="settings_select" name="webrd_sm'.$key.'_x">';
				foreach($mouse_array as $key2 => $value2){
					$selected = (isset($data['settings'][$var_select]) && $data['settings'][$var_select] == $key2) ? " selected" : "";
					echo '<option value="'.$key2.'"'.$selected.'>';
					echo $value2;
					echo '</option>';
				}
				echo '</select>';
				echo '</li>';
			}
			echo '</ul>';
			$options_array = array('250' => '0.25 seconds', '500' => '0.5 seconds', '1000' => '1 seconds', '1500' => '1.5 seconds', '2000' => '2 seconds');
			$checked = (isset($data['settings']['webrd_smv']) && $data['settings']['webrd_smv'] == "1") ? " checked" : "";
			echo '#mouse move (change pointer position)';
			echo '<ul>';
			echo '<li>';
			echo '<input type="checkbox" id="smv" class="settings_checkbox" name="webrd_smv" value="1"'.$checked.'><label for="smv">If I mouse move, it means server do mouse move.</label>';
			echo '</li>';
			echo '<li id="smv_y">';
			echo 'Send mouse move if idle in ';
			echo '<select id="smv_x" class="settings_select" name="webrd_smv_x">';
				foreach($options_array as $key2 => $value2){
					$selected = (isset($data['settings']['webrd_smv_x']) && $data['settings']['webrd_smv_x'] == $key2) ? " selected" : "";
					echo '<option value="'.$key2.'"'.$selected.'>';
					echo $value2;
					echo '</option>';
				}
				echo '</select>';
			echo '</li>';
			echo '</ul>';
			$mouse_array = array('wu' => 'scrolling up','wd' => 'scrolling down');
			$options_array = array('250' => '0.25 seconds', '500' => '0.5 seconds', '1000' => '1 seconds', '1500' => '1.5 seconds', '2000' => '2 seconds');
			echo '#mouse wheel ';
			echo '<ul>';
			foreach($mouse_array as $key => $value){
				$var_check = 'webrd_sm' . $key;
				$var_select = 'webrd_sm' . $key . '_x';
				$checked = (isset($data['settings'][$var_check]) && $data['settings'][$var_check] == "1") ? " checked" : "";
				echo '<li>';
				echo '<input type="checkbox" id="sm'.$key.'" class="settings_checkbox" name="webrd_sm'.$key.'" title="settings mouse '.$value.'" value="1"'.$checked.'>';
				echo '<label for="sm'.$key.'">if I '.$value.', it means server do </label>';
				echo '<select class="settings_select" name="webrd_sm'.$key.'_x">';
				foreach($mouse_array as $key2 => $value2){
					$selected = (isset($data['settings'][$var_select]) && $data['settings'][$var_select] == $key2) ? " selected" : "";
					echo '<option value="'.$key2.'"'.$selected.'>';
					echo $value2;
					echo '</option>';
				}
				echo '</select>';
				echo '</li>';
			}
			echo '<li id="smw_y">';
			echo 'Send scrolling if idle in ';
			echo '<select id="smw_x" class="settings_select" name="webrd_smw_x">';
				foreach($options_array as $key2 => $value2){
					$selected = (isset($data['settings']['webrd_smw_x']) && $data['settings']['webrd_smw_x'] == $key2) ? " selected" : "";
					echo '<option value="'.$key2.'"'.$selected.'>';
					echo $value2;
					echo '</option>';
				}
				echo '</select>';
			echo '</li>';
			echo '</ul>';
			$options_array = array('250' => '0.25 seconds', '500' => '0.5 seconds', '1000' => '1 seconds', '1500' => '1.5 seconds', '2000' => '2 seconds');
			$checked = (isset($data['settings']['webrd_sk']) && $data['settings']['webrd_sk'] == "1") ? " checked" : "";
			echo '#keystroke';
			echo '<ul>';
			echo '<li>';
			echo '<input type="checkbox" id="sk" class="settings_checkbox" name="webrd_sk" value="1"'.$checked.'><label for="sk">If I keystroke, it means server do keystroke.</label>';
			echo '</li>';
			echo '<li id="sk_y">';
			echo 'Send keystroke if idle in ';
			echo '<select id="sk_x" class="settings_select" name="webrd_sk_x">';
				foreach($options_array as $key2 => $value2){
					$selected = (isset($data['settings']['webrd_sk_x']) && $data['settings']['webrd_sk_x'] == $key2) ? " selected" : "";
					echo '<option value="'.$key2.'"'.$selected.'>';
					echo $value2;
					echo '</option>';
				}
				echo '</select>';
			echo '</li>';
			echo '</ul>';

			echo '#screenshot'; echo '<br>';


			$screenshot_array = array(
				'ss_auto' => array('name'=> 'auto reload screenshot every seconds', 'li_id' => ' id="item_ss_auto"', 'li_class' => '', 'desc' => 'Caution, consume more bandwith.'),
				'ss_k' => array('name'=> 'auto reload screenshot after send keystroke', 'li_id' => ' id="item_ss_k"', 'li_class' => ' class="child_of_item_ss_auto"', 'desc' => ''),
				'ss_mc' => array('name'=> 'auto reload screenshot after send mouse click', 'li_id' => ' id="item_ss_mc"', 'li_class' => ' class="child_of_item_ss_auto"', 'desc' => ''),
				'ss_mw' => array('name'=> 'auto reload screenshot after send mouse wheel', 'li_id' => ' id="item_ss_mw"', 'li_class' => ' class="child_of_item_ss_auto"', 'desc' => ''),
				'ss_mv' => array('name'=> 'auto reload screenshot after send mouse move', 'li_id' => ' id="item_ss_mv"', 'li_class' => ' class="child_of_item_ss_auto"', 'desc' => '')
			);
			echo '<ul>';
			foreach($screenshot_array as $key => $value){
				$var_check = 'webrd_' . $key;
				$checked = (isset($data['settings'][$var_check]) && $data['settings'][$var_check] == "1") ? " checked" : "";
				echo '<li'.$value['li_id'].$value['li_class'].'>';
				echo '<input type="checkbox" id="'.$key.'" class="settings_checkbox" name="webrd_'.$key.'" title="settings screenshot '.$value['name'].'" value="1"'.$checked.'>';
				echo '<label for="'.$key.'">'.$value['name'].'</label>';
				if(!empty($value['desc'])) echo '<span>' . $value['desc'] . '</span>';
				echo '</li>';
			}
			echo '</ul>';


			echo '</div><!--/#page_settings -->';


			echo '<div class="ajax_msg">';
			echo '</div><!--/.ajax_msg -->';

			echo '<div id="messages">';
			echo '</div><!--/#messages -->';
			echo '<textarea id="bacem" style="height:150px;width:200px"></textarea>';
			echo '</body>';
			echo '</html>';
	}
}

?>