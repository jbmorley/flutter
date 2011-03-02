<?php
$contents = file_get_contents('http://jbmorley:flurbles@twitter.com/statuses/friends_timeline.json');
print $contents;
?>