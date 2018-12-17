<?php
$post_data = json_decode(file_get_contents('php://input'), true); 
// the directory "data" must be writable by the server
$name = "data/".$post_data['name'].".csv"; 
$data = $post_data['data'];
// write the file to disk
file_put_contents($name, $data);
?>