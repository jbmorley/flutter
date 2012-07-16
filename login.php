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
	</body>	
</html>