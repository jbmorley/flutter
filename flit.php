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
			<?php include("js/flit.js"); ?>
			
			var user = '<?php echo $_POST['user']; ?>';
			var pass = '<?php echo $_POST['pass']; ?>';
			// -->
						
		</script>				
		<style>
		
			<?php include("css/flutter.css"); ?>
		
		</style>
		
	</head>
	
	<body id="all" onload="refresh();">

		<div id="write_super">
			<div id="write">
				<div id="remaining">140</div>
				<textarea id="new_tweet"></textarea>
			</div>
		</div>
		<ul id="feed"></ul>
		<div id="ld">Loading...</div>
		
	</body>
	
</html>