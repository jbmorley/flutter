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
				document.getElementById('user').value = prefs.getString("user");
				document.getElementById('pass').value = prefs.getString("pass");
				document.getElementById('user_form').submit();
			}
			
		
		</script>
			
		<body onload="load()">
			<form style='display:none;' id='user_form' method='post' action='http://flutter.jbmorley.co.uk/flit.php' target='flutter'>
				<input type='hidden' id='user' name='user' value='jbmorley'>
				<input type='hidden' id='pass' name='pass' value='flurbles'>
			</form>
			<iframe name="flutter" id="flutter"></iframe>
		</body>
	
	]]></Content>
</Module>