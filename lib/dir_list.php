<?php

$dir = $_REQUEST['dir']; // $_REQUEST contains contents of $_GET and $_POST and $_COOKIE

$filesArray = array(); 
$Counter = 0; 
$files = scandir($dir); 

foreach ($files as &$file) { 
    if ($file!='.' && $file!='..'
			
	&& (strpos(strtolower($file), '.jpg') !== FALSE)) // filter out non-graphic files
    { 
        $filesArray[$Counter] = $file; 
        $Counter++;
    }
} 

echo json_encode($filesArray); // return json object to ajax success handler
?>