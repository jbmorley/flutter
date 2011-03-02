<?php
$page = (array_key_exists('page', $_GET)) ? $_GET['page'] : 1;
$contents = file_get_contents('http://jbmorley:flurbles@twitter.com/statuses/friends_timeline.json?page='.$page);
print $contents;
?>