<?php 
	header('Content-type: application/xml; charset="utf-8"',true);
	header("Content-Type: application/xml");
	print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
?>
<Module>
	<ModulePrefs
		title="Flutter"
		author="Jason Barrie Morley"
		author_email="jason.morley@gmail.com"
		description="A light-weight Twitter client supporting threading of direct messages and @replies."
		screenshot="http://flutter.jbmorley.co.uk/images/screenshot.png"
		thumbnail="http://flutter.jbmorley.co.uk/images/thumbnail.png"
		height="350">
		
		<OAuth>
			<Service name="twitter">
				<Access url="http://twitter.com/oauth/access_token" /> 
				<Request url="http://twitter.com/oauth/request_token" /> 
				<Authorization url="http://twitter.com/oauth/authorize?oauth_callback=http://oauth.gmodules.com/gadgets/oauthcallback" /> 
			</Service>
		</OAuth>
		
	</ModulePrefs>
	
	<UserPref name="user" display_name="Username" required="true" datatype="string" />
	<UserPref name="pass" display_name="Password" required="true" datatype="string" />
	
	
	<Content type="html"><![CDATA[


		<style>
			<?php include("css/flutter.css"); ?>
		</style>
		
		<script>
			
			<?php include("js/prototype.js"); ?>
			<?php include("js/builder.js"); ?>
			<?php include("js/effects.js"); ?>
			<?php include("js/scriptaculous.js"); ?>
			<?php include("js/date.js"); ?>
			<?php include("js/flutter2.js"); ?>
		
		</script>
			
		<body onload="refresh();">
			<div id="main"></div>
			<div id="write_super">
				<div id="write">
					<div id="remaining">140</div>
					<textarea id="new_tweet"></textarea>
				</div>
				<div id="ld">Loading...</div>
			</div>
			<div id='all'>
				<ul id="feed"></ul>
			</div>
		</body>
	
	]]></Content>
</Module>