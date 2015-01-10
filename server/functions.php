<?php

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
	$url = $data['setting']['client'];
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