<?php

	$user = (array_key_exists('user', $_GET)) ? $_GET['user'] : "";
	$pass = (array_key_exists('pass', $_GET)) ? $_GET['pass'] : "";
	$id = isset($_POST['id']) ? $_POST['id'] : '';

	// Get the parameters
	define('POSTURL', 'http://'.$user.':'.$pass.'@twitter.com/favorites/create/'.$id.'.json');	
	
	// Ensure that this page is only ever called as a post
	if ($_SERVER['REQUEST_METHOD'] === 'POST') {

		// Construct the CURL call	
		$ch = curl_init(POSTURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS    ,'id='.$id);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_HEADER, 0);  // DO NOT RETURN HTTP HEADERS
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);  // RETURN THE CONTENTS OF THE CALL
		$data = curl_exec($ch);

		// Issue the output
		ob_start();
		header("Content-Type: text/html");
		
		print $data;

		print ob_get_clean();
		
		curl_close($ch);
		
	} else {
	
		die('Hacking attempt Logged!');
		
	}

?>