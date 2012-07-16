<html>
	<head>
		<title>Flutter Login</title>
		<style>
		
			<?php include("css/flutter.css"); ?>

			body
				{
				text-align: center;
				}			

			#login
				{
				background-color: #e8eefa;
				padding: 20px;
				margin: 50px auto;
				width: 250px;
				}
				
			#submit
				{
				text-align: center;
				}
			
		</style>
		
	</head>
	<body>
		<form id='user_form' method='post' action='http://flutter.jbmorley.co.uk/flutter.php' target='flutter'>
			<div id="login">
				<table>
					<tr><th>Username:</th><td><input type='text' name='user' value='' /></td></tr>
					<tr><th>Password:</th><td><input type='password' name='pass' value='' /></td></tr>
					<tr><td id="submit" colspan='2'><input type='submit' value='Login' /></tr></td>
				</table>
			</div>
		</form>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-8809677-1");
pageTracker._trackPageview();
} catch(err) {}</script>
	</body>	
</html>