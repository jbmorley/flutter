<html>
	<head>
		<title>Flutter</title>
	</head>
	
	<style>
		body
			{
			text-align: center;
			}
	
		#flutter
			{
			border: 1px solid grey;
			overflow-y: scroll;
			margin: auto;
			width: 400px;
			height: 500px;
			padding: 5px 0 5px 5px;
			}
	</style>
	
	<form style='display:none;' id='user_form' method='post' action='http://flutter.jbmorley.co.uk/flit.php' target='flutter'>
		<input type='hidden' name='user' value='jbmorley'>
		<input type='hidden' name='pass' value='flurbles'>
	</form>
		
	<body onload="document.getElementById('user_form').submit();">
		<iframe name="flutter" id="flutter" src=""></iframe>
	</body>
</html>