<?php

function microtime_float(){
    list($usec, $sec) = explode(" ", microtime());
    return ((float)$usec + (float)$sec);
}

function create_log($msg,$time=null){
	if(is_null($time)) $time = defined('TIME') ? TIME : time();
	if(defined('CREATE_LOG') && !CREATE_LOG) return;
	if(defined('DIRNAME_LOG') && !file_exists(DIRNAME_LOG)) mkdir(DIRNAME_LOG,0755,TRUE);
	$path_file_log = defined('PATH_FILE_LOG') ? PATH_FILE_LOG : $time.".log";
	$name = defined('NAME') ? NAME : "unnamed";
	$fopen = fopen($path_file_log, "a");
	fwrite($fopen, $name . "\t" . $time . "\t" . date("Y-m-d", $time) . "\t" . date("H:i:s", $time) .  "\t|\t" . date("H:i:s") . "\t" . $msg . "\r\n");
	fclose($fopen);
}

function translate(&$text){
	$before = array(); $after = array();	
	$before[] = "[8]"; $after[] = "{Backspace}";
	$before[] = "[9]"; $after[] = "{Tab}";
	$before[] = "[13]"; $after[] = "{Enter}";
	$before[] = "[19]"; $after[] = "{Pause}";	
	$before[] = "[20]"; $after[] = "{CapsLock}";
	$before[] = "[27]"; $after[] = "{Esc}";
	$before[] = "[32]"; $after[] = "{Space}";
	$before[] = "[33]"; $after[] = "{PgUp}";
	$before[] = "[34]"; $after[] = "{PgDn}";
	$before[] = "[35]"; $after[] = "{End}";
	$before[] = "[36]"; $after[] = "{Home}";
	$before[] = "[37]"; $after[] = "{Left}";
	$before[] = "[38]"; $after[] = "{Up}";
	$before[] = "[39]"; $after[] = "{Right}";
	$before[] = "[40]"; $after[] = "{Down}";
	$before[] = "[45]"; $after[] = "{Insert}"; 	
	$before[] = "[46]"; $after[] = "{Delete}"; 
	$before[] = "[48]"; $after[] = "0"; 
	$before[] = "[49]"; $after[] = "1"; 
	$before[] = "[50]"; $after[] = "2"; 
	$before[] = "[51]"; $after[] = "3"; 
	$before[] = "[52]"; $after[] = "4"; 
	$before[] = "[53]"; $after[] = "5"; 
	$before[] = "[54]"; $after[] = "6"; 
	$before[] = "[55]"; $after[] = "7"; 
	$before[] = "[56]"; $after[] = "8"; 
	$before[] = "[57]"; $after[] = "9"; 
	$before[] = "[61]"; $after[] = "="; 
	$before[] = "[65]"; $after[] = "a"; 
	// $before[] = "[65]"; $after[] = "{WheelUp 20}"; 
	// $before[] = "[65]"; $after[] = "{Click 100, 200}"; 	
	// $before[] = "[65]"; $after[] = "{Click 6, 52, down}{click 45, 52, up}"; 		
	$before[] = "[66]"; $after[] = "b"; 
	$before[] = "[67]"; $after[] = "c"; 
	$before[] = "[68]"; $after[] = "d"; 
	$before[] = "[69]"; $after[] = "e"; 
	$before[] = "[70]"; $after[] = "f"; 
	$before[] = "[71]"; $after[] = "g"; 
	$before[] = "[72]"; $after[] = "h"; 
	$before[] = "[73]"; $after[] = "i"; 
	$before[] = "[74]"; $after[] = "j"; 
	$before[] = "[75]"; $after[] = "k"; 
	$before[] = "[76]"; $after[] = "l"; 
	$before[] = "[77]"; $after[] = "m"; 
	$before[] = "[78]"; $after[] = "n"; 
	$before[] = "[79]"; $after[] = "o"; 
	$before[] = "[80]"; $after[] = "p"; 
	$before[] = "[81]"; $after[] = "q"; 
	$before[] = "[82]"; $after[] = "r"; 
	$before[] = "[83]"; $after[] = "s"; 
	$before[] = "[84]"; $after[] = "t"; 
	$before[] = "[85]"; $after[] = "u"; 
	$before[] = "[86]"; $after[] = "v"; 
	$before[] = "[87]"; $after[] = "w"; 
	$before[] = "[88]"; $after[] = "x"; 
	$before[] = "[89]"; $after[] = "y"; 
	$before[] = "[90]"; $after[] = "z"; 
	$before[] = "[91]"; $after[] = "{LWin}"; 
	$before[] = "[93]"; $after[] = "{AppsKey}"; 
	$before[] = "[96]"; $after[] = "0"; 
	$before[] = "[97]"; $after[] = "1"; 
	$before[] = "[98]"; $after[] = "2"; 
	$before[] = "[99]"; $after[] = "3"; 
	$before[] = "[100]"; $after[] = "4"; 
	$before[] = "[101]"; $after[] = "5"; 
	$before[] = "[102]"; $after[] = "6"; 
	$before[] = "[103]"; $after[] = "7"; 
	$before[] = "[104]"; $after[] = "8"; 
	$before[] = "[105]"; $after[] = "9"; 
	$before[] = "[106]"; $after[] = "{NumpadMult}"; 
	$before[] = "[107]"; $after[] = "{NumpadAdd}"; 
	$before[] = "[109]"; $after[] = "{NumpadSub}"; 
	$before[] = "[111]"; $after[] = "{NumpadDiv}"; 
	$before[] = "[112]"; $after[] = "{F1}"; 
	$before[] = "[113]"; $after[] = "{F2}"; 
	$before[] = "[114]"; $after[] = "{F3}"; 
	$before[] = "[115]"; $after[] = "{F4}"; 
	$before[] = "[116]"; $after[] = "{F5}"; 
	$before[] = "[117]"; $after[] = "{F6}"; 
	$before[] = "[118]"; $after[] = "{F7}"; 
	$before[] = "[119]"; $after[] = "{F8}"; 
	$before[] = "[120]"; $after[] = "{F9}"; 
	$before[] = "[121]"; $after[] = "{F10}"; 
	$before[] = "[122]"; $after[] = "{F11}"; 
	$before[] = "[123]"; $after[] = "{F12}"; 
	$before[] = "[145]"; $after[] = "{ScrollLock}"; 
	$before[] = "[173]"; $after[] = "-"; 
	$before[] = "[188]"; $after[] = "{,}"; // Harus kurung kurawal, karena jika polos akan error. Tanda koma adalah syntax untuk memisahkan argument pada function Send
	$before[] = "[190]"; $after[] = "."; 
	$before[] = "[191]"; $after[] = "/"; 
	$before[] = "[192]"; $after[] = "`";
	$before[] = "[219]"; $after[] = "["; 
	$before[] = "[220]"; $after[] = "\\"; 
	$before[] = "[221]"; $after[] = "]"; 
	$text = str_replace($before,$after,$text);
}

function write_ini_file($assoc_arr, $path, $has_sections=FALSE) {
    $content = "";
    if ($has_sections) {
        foreach ($assoc_arr as $key=>$elem) {
            $content .= "[".$key."]\r\n";
            foreach ($elem as $key2=>$elem2) {
                if(is_array($elem2))
                {
                    for($i=0;$i<count($elem2);$i++)
                    {
                        $content .= $key2."[] = \"".$elem2[$i]."\"\r\n";
                    }
                }
                else if($elem2=="") $content .= $key2." = \r\n";
                else $content .= $key2." = \"".$elem2."\"\r\n";
            }
        }
    }
    else {
        foreach ($assoc_arr as $key=>$elem) {
            if(is_array($elem))
            {
                for($i=0;$i<count($elem);$i++)
                {
                    $content .= $key."[] = \"".$elem[$i]."\"\r\n";
                }
            }
            else if($elem=="") $content .= $key." = \r\n";
            else $content .= $key." = \"".$elem."\"\r\n";
        }
    }

    if (!$handle = fopen($path, 'w')) {
        return false;
    }
    if (!fwrite($handle, $content)) {
        return false;
    }
    fclose($handle);
    return true;
}

function create_file($path,$mode,$content){
	$dirname = dirname($path);
	if(!file_exists($dirname))  mkdir($dirname, 0755, TRUE);
	if(!$fopen = fopen($path, $mode)) return false;
	if(!$fwrite = fwrite($fopen, $content)) return false;
	fclose($fopen);
	return true;
}

function curl_set($url, $form = NULL, $proxy = NULL){

// $url="string"; // http://your_url_request
// $form['method'] = get
// $form['method'] = post
// $form['data'] = array();
// $proxy=array();
// $proxy['host']="string";
// $proxy['port']="string";
// $proxy['username']="string";
// $proxy['password']="string";


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT,3);

	if(!is_null($form)){
		if($form['method'] == "get"){
			//rapihkan url
			if(preg_match("/\&$/",$url)) $url = substr($url, 0, -1);
			if(preg_match("/\?/",$url)) $variable = "&"; else $variable = "?";
			$http_build_query = count($form['data']) ? http_build_query($form['data']) : "";
			$url = $url.$variable.$http_build_query ;
		}
		elseif($form['method'] == "post"){
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $form['data']);
		}
	}
	if(!is_null($proxy)){
		if(isset($proxy['host'])) {
			curl_setopt($ch, CURLOPT_PROXY, $proxy['host']);
			if(isset($proxy['port'])) curl_setopt($ch, CURLOPT_PROXYPORT, 8080);
			if(isset($proxy['username'])) $auth = $proxy['username'];
			if(isset($proxy['password'])) $auth = $auth . ":" . $proxy['password'];
			if(isset($auth)) curl_setopt($ch, CURLOPT_PROXYUSERPWD, $auth);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('Expect:')); // http://stackoverflow.com/questions/6244578/curl-post-file-behind-a-proxy-returns-error
		}
	}
	curl_setopt($ch, CURLOPT_URL, $url);
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

function phprd_post(){

	global $data;

	//konfigurasi
	$url = $data['settings']['client'];
	$form = array();
	$form['method'] = "post";

	//input value
	if(isset($data['server_request']['variable'])){
		foreach($data['server_request']['variable'] as $id => $value){
			$form['data'][$id] = $value;
		}
	}

	//input file
	if(isset($data['server_request']['file'])){
		foreach($data['server_request']['file'] as $id => $value){
			$form['data'][$id] = '@'. $value;
		}
	}

	// $form['data']['custom'] = "custom";

	// if($config['server']['proxy']['host'] != ''){
		// $proxy=array();
		// $proxy['host']=$config['server']['proxy']['host'];
		// if($config['server']['proxy']['port'] != '') $proxy['port']=$config['server']['proxy']['port'];
		// if($config['server']['proxy']['username'] != '') $proxy['username']=$config['server']['proxy']['username'];
		// if($config['server']['proxy']['password'] != '') $proxy['password']=$config['server']['proxy']['password'];
	// }


	return curl_set($url, $form);
}

function backup_file_if_exists($path){
	if(!file_exists($path)) return false;
	$date = filemtime($path);
	$bak = dirname($path) . "/" . pathinfo($path, PATHINFO_FILENAME) . "_" . $date . "." . pathinfo($path, PATHINFO_EXTENSION);
	rename($path,$bak);
}

function file_exists_loop($file, $time){
	//$time in second, but we use usleep in 1/4 second
	$time *= 4;
	$found = false;
	for($i=0; $i<$time; $i++){
		if(file_exists($file)){
			$found = true;
			break;
		}
		usleep(250000);// 1/4 second
	}
	return $found;
}
?>