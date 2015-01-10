<?php

foreach ($_GET as $key => $val) $$key=$val;
foreach ($_POST as $key => $val) $$key=$val;
foreach ($_COOKIE as $key => $val) $$key=$val;
foreach ($_FILES as $key => $val) $$key=$val;

// sleep(1);
// $arr=array("id" => 1, "msg" => "Login Berhasil");
// echo json_encode($arr);

sleep(10);
$arr=array("id" => 1, "msg" => "Login Berhasil");
if($has_js) echo json_encode($arr);
else header("Location:index.php");

?>