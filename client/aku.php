<?php
// $dir = getcwd();
// $scandir = scandir($dir);
// $all = array();
// foreach($scandir as $file){
	// $pola = '/^client_request\.(.*)\.ini/';
	// if(preg_match($pola, $file, $matches)){
		// $time = $matches[1];
		// $array = parse_ini_file($file);
		// $all[$time] = $array;
	// }
// }
// print_r($all);
$replacements = array();
$replacements[2] = 'bear';
$replacements[1] = 'black';
$replacements[0] = 'slow';
$array1 = array('blue'  => 8, 'red'  => 2, 'green'  => 3, 'purple' => 4);
$array2 = array('green' => 5, 'blue' => 5, 'yellow' => 7, 'cyan'   => 8);

print_r(array_intersect_key($array1, $array2));
// print_r($replacements);
print_r($array2);
?>