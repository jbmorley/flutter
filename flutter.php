<html>

	<head>
		<title>Flutter Inline</title>

		<script type="text/javascript">
			
			//<!--
			<?php include("js/prototype.js"); ?>
			<?php include("js/builder.js"); ?>
			<?php include("js/effects.js"); ?>
			<?php include("js/scriptaculous.js"); ?>
			<?php include("js/date.js"); ?>
			<?php include("js/flutter.js"); ?>
			
			var user = '<?php echo $_POST['user']; ?>';
			var pass = '<?php echo $_POST['pass']; ?>';
			// -->
						
		</script>				
		<style>
		
			<?php include("css/flutter.css"); ?>
		
		</style>
		
	</head>
	
	<body onload="refresh();">

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