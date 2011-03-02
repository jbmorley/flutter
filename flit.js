/*
 * http://twitter.com/statuses/public_timeline.json
 * http://twitter.com/statuses/friends_timeline.json
 * http://twitter.com/direct_messages.json
 * http://twitter.com/statuses/update.json
 *
 */
 
var ids = new Array();

function refresh() {
	setup_events();
	fetch('/flit/statuses/friends_timeline.php');
}

function setup_events() {

	$('new_tweet').observe('keyup', function(event) {
		var left = 140 - ($('new_tweet').value.length);
		if (event.keyCode == Event.KEY_RETURN) {
			if (left >= -1) {
				$('new_tweet').addClassName('updating');
				update($('new_tweet').value);
			}
		} else {
			$('remaining').update(left);
			if (left < 0) {
				$('remaining').addClassName('error');
				$('remaining').removeClassName('warning');
			} else if (left < 11) {
				$('remaining').addClassName('warning');
				$('remaining').removeClassName('error');
			} else {
				$('remaining').removeClassName('warning');
				$('remaining').removeClassName('error');
			}
		}
	});
	
}

function fetch(url) {
	
	new Ajax.Request(url,
	  {
		method:'get',
		onSuccess: function(transport) {
			var result = interpret(transport.responseText);
			for (var i=result.length-1; i>=0; i--) {
				add(result[i]);
			}
		  
			// Set the refresh again...
			setTimeout('fetch(' + '"' + url + '");', 300000);
		  
		},
		onFailure: function() {
			alert('Unable to query Twitter.  Please try again later.');
		}
	  });
}

function interpret(json) {
	var text = "var ret = " + json;
	eval(text);
	return ret;
}

function update(message) {
	
	new Ajax.Request('/flit/statuses/update.php', {
		method: 'post',
		parameters: { status: message },
		onSuccess: function(transport) {
		
			add(interpret(transport.responseText));
			
			// TODO Refactor this into a slightly more elegant location
			$('new_tweet').value = '';
			$('new_tweet').removeClassName('updating');
			$('remaining').update('140');
			$('remaining').removeClassName('error');
			$('remaining').removeClassName('warning');
			
		},
		onFailure: function() {
			alert('Unable to post to Twitter.  Please try again later.')
		}
	});
}

function add(tweet) {
	
	if (ids[tweet.id] != 1) {
	
		ids[tweet.id] = 1;
		
		var image = Builder.node('img');
		image.src = tweet.user.profile_image_url;
		image.addClassName('profile');
		var user = Builder.node('a');
		user.href = 'http://twitter.com/' + tweet.user.screen_name + '/';
		user.target = '_blank';
		user.insert(image);
		
		var cell_image = Builder.node('td');
		cell_image.width = "48px";
		cell_image.insert(user);
		
		var cell_text  = Builder.node('td');
		
		var name = Builder.node('p');
		
		var star = Builder.node('img');
		if (tweet.favorited) {
			star.src = 'images/star-on.png';
		} else {
			star.src = 'images/star-off.png';				
		}
		star.addClassName('star');
		
		name.insert(star);
		name.insert(tweet.user.name);
		name.addClassName('name');
		cell_text.insert(name);
		
		// Replace links
		// TODO Refactor me into a nice little utility function
		var text = tweet.text;
		var url  = new RegExp('(http://\\S+[^\\.^\\s]+)');
		text = text.replace(url, '<a target=\'_blank\' href="$1">$1</a>');
		
		cell_text.insert('<p>' + text + '</p>');
		
		var at = Builder.node('p', tweet.created_at);
		at.addClassName('at');
		cell_text.insert(at);
		
		cell_text.onclick =
			function() {
				var new_tweet = $('new_tweet');
	
				var reply  = "@" + tweet.user.screen_name + " ";
				var direct = "d " + tweet.user.screen_name + " ";
				
				if (new_tweet.value != reply) {
					new_tweet.value = reply;
					new_tweet.activate();
					doSetCaretPosition(new_tweet, reply.length);
				} else if (new_tweet.value == reply) {
					new_tweet.value = direct;
					new_tweet.activate();
					doSetCaretPosition(new_tweet, direct.length);
				}
	
			}
		
		var row_layout = Builder.node('tr');
		row_layout.insert(cell_image);
		row_layout.insert(cell_text);
		
		var table_layout = Builder.node('table');
		table_layout.insert(row_layout);
	
		var li = Builder.node('li');
		// li.style.display = 'none';
		li.insert(table_layout);
		
		// Reply
		if (tweet.in_reply_to_user_id != null) {
			li.addClassName('reply');
		}
		
		$('feed').insert({ top:li });
		// Effect.Appear(li, { queue:'end', duration:0.6 });
		
	}

}

/*
** Sets the caret (cursor) position of the specified text field.
** Valid positions are 0-oField.length.
*/
function doSetCaretPosition (oField, iCaretPos) {

	// IE Support
	if (document.selection) { 
	
		oField.focus();
		var oSel = document.selection.createRange();
		oSel.moveStart('character', -oField.value.length);
	
		oSel.moveStart('character', iCaretPos);
		oSel.moveEnd('character', 0);
		oSel.select();
	}
	
	// Firefox support
	else if (oField.selectionStart || oField.selectionStart == '0') {
		oField.selectionStart = iCaretPos;
		oField.selectionEnd = iCaretPos;
		oField.focus();
	}
}