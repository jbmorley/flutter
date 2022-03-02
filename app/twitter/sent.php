<?php
$user = (array_key_exists('user', $_POST)) ? $_POST['user'] : "";
$pass = (array_key_exists('pass', $_POST)) ? $_POST['pass'] : "";

// http://twitter.com/direct_messages.format
$contents = file_get_contents('https://'.$user.':'.$pass.'@twitter.com/direct_messages/sent.json');
print $contents;

?>