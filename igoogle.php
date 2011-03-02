<?php
	header ("Content-Type:text/xml");
	print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
?>
<Module>
	<ModulePrefs title="Flutter" height="350" />
	<UserPref name="user" display_name="Username" required="true" />
	<UserPref name="pass" display_name="Password" required="true" />
	<Content type="html"><![CDATA[
	
		<style>
			body
				{
				text-align: center;
				}
		
			#flutter
				{
				border: 0;
				margin: 0;
				padding: 0;
				overflow-y: scroll;
				margin: auto;
				width: 100%;
				height: 100%;
				}
		</style>
		
		<script>
		
			function load() {
				var prefs = new gadgets.Prefs();
				
				var user = prefs.getString("user");
				var pass = prefs.getString("pass");
				
				var url = "http://www.jbmorley.co.uk/flit/flit.php?user=" + user + "&pass=" + pass;
				
				document.getElementById('flutter').src = url;
			}
			
		
		</script>
			
		<body onload="load()">
			<iframe id="flutter"></iframe>
		</body>
	
	]]></Content>
</Module>