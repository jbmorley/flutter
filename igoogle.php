<?php
	header ("Content-Type:text/xml");
	print "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
?>
<Module>
<ModulePrefs title="Flutter" height="350" />
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
		
	<body>
		<iframe id="flutter" src="http://www.jbmorley.co.uk/flit/flit.php"></iframe>
	</body>

]]></Content>
</Module>