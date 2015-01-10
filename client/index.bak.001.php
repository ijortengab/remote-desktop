<?php



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
  $data['setting']             = (array) data dari file settings.ini, berisi konfigurasi dan database
  $data['setting']['password'] = (string) password untuk mengakses file ini.
  $data['setting']['msg']      = (string) pesan untuk disampaikan kepada user
  $data['phprd']               = (string) data cookie berisi session yang didapat oleh user
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
// exit;

header("Pragma: no-cache");
header("Cache-Control: no-store");
foreach ($_GET as $key => $val) $data[$key]=$val;
foreach ($_POST as $key => $val) $data[$key]=$val;
foreach ($_COOKIE as $key => $val) $data[$key]=$val;
foreach ($_FILES as $key => $val) $data[$key]=$val;
include('functions.php');

// $isi = file_get_contents('settings.ini');
if(!file_exists('settings.ini')){
	$array = array(
		'password' => md5('a'),
	);
	write_ini_file($array,'settings.ini');
}


$data['setting'] = parse_ini_file("settings.ini");

//jika ada masalah dengan settings.ini saat proses, maka hilangkan dan bikin baru.
if(empty($data['setting'])){
	unlink('settings.ini');
	header('Location: '. this_file());
}
if(empty($data['setting']['password'])){
	unlink('settings.ini');
	header('Location: '. this_file());
}


// print_r($data['setting']);
// exit;
$loggedon = '';
$auth_pass ='a';

define(DIRNAME_SCREENSHOT, 'screenshots');
define(PATH_FILE_SCREENSHOT, getcwd() . '/'. DIRNAME_SCREENSHOT .'/screenshot.jpg');

if($data['phprd'] == $data['setting']['password']){ // authenticated user
		switch($data['client_action']){
			case 'logout': process('logout'); break;
			case 'server_do_something': process('server_do_something'); break;
			default: process();
		}
}
else{ // anonymous user
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
			default: draw('form_login');
		}
	}
    else draw('form_login');
}

function read($file){
	global $data;
	switch($file){
		case "client_request.ini":
			if(file_exists("client_request.ini")){
				print serialize(parse_ini_file("client_request.ini", TRUE));
				unlink("client_request.ini");
			}
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
			write_ini_file($data['client_request'],"client_request.ini",TRUE);
			break;
		case "settings.ini":
			write_ini_file($data['setting'],"settings.ini");
			break;
			
	}
}

function process($action=NULL){
	global $data;
	switch($action){
		case 'logout':
			setcookie("phprd", "", 0, '/'); //jika tidak ada path, maka menghilangkan cookie akan gagal
			$data['setting']['msg'] = "Anda berhasil logout";
			write('settings.ini');
			header('Location: '. this_file());
			break;	
		case 'login':
			sleep(2);// sementara
			if($data['setting']['password'] == md5($data['client_action_password_value'])){
				$data['client_request']['screenshot']['reload'] = TRUE;
				write('client_request.ini');
				$extra = md5($data['client_action_password_value']);
				echo json_encode(array("id" => 1, "msg" => "Login Success", "act" => "", "extra" => $extra));
			}
			else{
				echo json_encode(array("id" => 0, "msg" => "Login Failed", "act" => "Try Again"));
			}
			break;
		case 'server_do_something':
			// CREATE FILE COMMAND			
			$data['client_request']['screenshot']['reload'] = $data['client_action_screenshot_reload'];
			write('client_request.ini');
			
			// WAITING FOR OUTPUT
			if(!file_exists_loop(".confirm",20)){//jika gagal				
				delete_if_exists('client_request.ini');
				delete_if_exists('.confirm');
				$extra = '';
				echo json_encode(array("id" => 0, "msg" => "No response from server.", "act" => "", "extra" => $extra));
			}
			else{
				delete_if_exists('client_request.ini');
				delete_if_exists('.confirm');
				$extra = the_last_screenshot();
				echo json_encode(array("id" => 1, "msg" => "Done", "act" => "", "extra" => $extra));
			}
			
			
			break;
		default:
			if(file_exists("client_request.ini")) {
				if(!file_exists_loop(".confirm",20)){
					delete_if_exists('client_request.ini');
					delete_if_exists('.confirm');
					setcookie("phprd", "", 0, '/'); //jika tidak ada path, maka menghilangkan cookie akan gagal
					$data['setting']['msg'] = "tidak ada respon dari server";
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
	$list = scandir(DIRNAME_SCREENSHOT);
	if(!file_exists(DIRNAME_SCREENSHOT)) mkdir(DIRNAME_SCREENSHOT,0755,TRUE);
	$list = scandir(DIRNAME_SCREENSHOT);
	if(count($list) == 2){ //it means Array ( [0] => . [1] => .. ) 
		// create sample image
		$im = imagecreatetruecolor(600, 400);
		$text_color = imagecolorallocate($im, 255, 255, 255);
		imagestring($im, 5, 200, 100,  'Screenshot not found', $text_color);	
		imagejpeg($im, DIRNAME_SCREENSHOT . '/screenshot.jpg');	
		imagedestroy($im);
		// replay
		$list = scandir(DIRNAME_SCREENSHOT);
	}
	$the_last_screenshot = array_pop($list);
	$screenshot = DIRNAME_SCREENSHOT . '/'. $the_last_screenshot;
	return $screenshot;	
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
			if(isset($data['setting']['msg'])){
				$msg = $data['setting']['msg'];
				$data['setting']['msg'] = "";
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
			$html .='<script src="lib/phprd_login.js"></script>';
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
			$html .='<input type="hidden" name="client_action" value="login">';
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
			echo '<!DOCTYPE html>';
			echo '<html>';
			echo '<head>';
			echo '<title>';
			echo 'PHP Remote Desktop';
			echo '</title>';
			echo '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			echo '<link rel="stylesheet" href="lib/style.css" type="text/css">';
			echo '<script src="lib/jquery.min.js?v=1.8.3"></script>';
			echo '<script src="lib/phprd_basic.js"></script>';
			echo '<div id="page" style="width:'.$width.'px;">';
			echo '<div id="nav">';
			echo '<ul class="links">';
			echo '<li>';
			echo '<a>';
			echo 'Reload';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a>';
			echo 'Keystroke';
			echo '</a>';
			echo '</li>';
			echo '<li>';
			echo '<a>';
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
			echo '<div id="img-background" style="width:'.$width.'px;height:'.$height.'px;background:url('.$screenshot.');">';
			echo '<div id="img-disabled" style="width:'.$width.'px;height:'.$height.'px;background:url('.$screenshot.');">';
			echo '<div id="img" style="width:'.$width.'px;height:'.$height.'px;background:url('.$screenshot.');">';
			// echo '<img id="img" src="screenshot/'.$the_last_screenshot.'">';
			echo '</div><!--/#img -->';
			echo '</div><!--/#img-disabled -->';
			echo '</div><!--/#img-background -->';
			echo '</div><!--/#page -->';
			echo '<script type="text/javascript">';
			// echo 'writemenu();';
			echo '</script>';
			echo '<form name="form_client" method="post" id="form_client" action="">';
			echo '<input type="text" name="client_action" value="server_do_something">';
			echo '<input type="text" name="client_action_screenshot_reload" value="1">';
			// echo '<input type="text" name="client_action_click" value="click">';
			// echo '<input type="text" name="client_action_click_x" value="">';
			// echo '<input type="text" name="client_action_click_y" value="">';
			// echo '<input type="text" name="client_action_click_mode" value="">';
			// echo '<input type="text" name="client_action_click_button" value="">';
			// echo '<input type="text" name="client_action_click_count" value="">';
			// echo '<input type="text" name="client_action_keystroke" value="">';
			// echo '<input type="text" name="client_action_keystroke_value" value="">';
			/* echo '<input type="text" name="client_action_screenshot" value="<?php echo $client_action_screenshot;?>">';
			echo '<input type="text" name="client_action_screenshot_delay" value="<?php echo $client_action_screenshot_delay;?>">'; */
			echo '</form>';
			echo '<img id="hideimage" style="display:none;">';					
			echo '<div class="ajax_msg">';			
			echo '</div><!--/.ajax_msg -->';
			echo '</body>';
			echo '</html>';
	}
}


?>