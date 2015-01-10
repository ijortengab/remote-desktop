<?php

define(DIRNAME_SCREENSHOT, 'screenshot');
define(PATH_FILE_SCREENSHOT, getcwd() . '/'. DIRNAME_SCREENSHOT .'/screenshot.jpg');

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
?>