<html>

	<head>
		<title>Flutter Inline</title>

		<script type="text/javascript">
			
			//<!--
			<?php include("prototype.js"); ?>
			<?php include("builder.js"); ?>
			<?php include("effects.js"); ?>
			<?php include("scriptaculous.js"); ?>
			<?php include("flit.js"); ?>
			
			var user = '<?php echo $_GET['user']; ?>';
			var pass = '<?php echo $_GET['pass']; ?>';
			// -->
						
		</script>				
		<style> @import url("flit.css"); </style>
		
	</head>
	
	<body id="all" onload="refresh();">

		<div id="write_super">
			<div id="write">
				<div id="remaining">140</div>
				<textarea id="new_tweet"></textarea>
			</div>
		</div>
		<ul id="feed"></ul>
		
	</body>
	
</html>