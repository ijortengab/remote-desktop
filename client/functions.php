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

function backup_file_if_exists($path){
	if(!file_exists($path)) return false;
	$date = filemtime($path);
	$bak = dirname($path) . "/" . pathinfo($path, PATHINFO_FILENAME) . "_" . $date . "." . pathinfo($path, PATHINFO_EXTENSION);
	rename($path,$bak);
}

function delete_if_exists($file){
	if(file_exists($file)) unlink($file);
}


function this_file(){
	return htmlentities(basename($_SERVER['PHP_SELF']));
}

?>
