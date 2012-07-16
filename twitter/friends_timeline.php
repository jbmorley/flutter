<?php
$page = (array_key_exists('page', $_GET)) ? $_GET['page'] : 1;

$user = (array_key_exists('user', $_GET)) ? $_GET['user'] : "";
$pass = (array_key_exists('pass', $_GET)) ? $_GET['pass'] : "";

$contents = file_get_contents('http://'.$user.':'.$pass.'@twitter.com/statuses/friends_timeline.json?page='.$page);
print $contents;

?>