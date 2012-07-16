/*
 * http://twitter.com/statuses/public_timeline.json
 * http://twitter.com/statuses/friends_timeline.json
 * http://twitter.com/direct_messages.json
 * http://twitter.com/statuses/update.json
 *
 */
 
var maxid = 0;
var page = 1;
var ids = new Array();
var updating = false;
var link_clicked = false;

function refresh() {
	setup_events();
	fetch('/twitter/friends_timeline.php', page);
}

function should_load_more() {

	var height = $('all').getDimensions().height;
	var scroll = document.viewport.getScrollOffsets().top;
	
	if ( scroll >= ( height - 700 ) ) {
		return true;
	} else {
		return false;
	}

}

function setup_events() {

	Event.observe(window, 'scroll', function() { 
  		
  		if (should_load_more() && !updating) {
  		
  			page++;
  			fetch('/twitter/friends_timeline.php', page);
			
  		}
 
	});

	$('new_tweet').observe('keydown', function(event) {
		var left = 140 - ($('new_tweet').value.length);
		if (event.keyCode == Event.KEY_RETURN) {
			Event.stop(event);
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

function fetch(url, page) {
	
	updating = true;
	$('ld').style.display = 'block';
	var fetch = url + '?page=' + page;
	
	new Ajax.Request(fetch,
	  {
		method:'post',
		parameters: { 'user': user, 'pass': pass },
		onSuccess: function(transport) {
			var result = interpret(transport.responseText);
			for (var i=0 ; i<result.length; i++) {
				add(result[i]);
			}
		  
		  	should_load_more();
		  	
			setTimeout('fetch(' + '"' + url + '");', 300000);

			updating = false;
			$('ld').style.display = 'none';
		  
		},
		onFailure: function() {
			alert('Unable to query Twitter.  Please try again later.');
			
			updating = false;
			$('ld').style.display = 'none';

		}
	  });
}

function interpret(json) {
	var text = "var ret = " + json;
	eval(text);
	return ret;
}

function create(tweet_id) {
	
	var create = '/twitter/create.php';
	$('favorite_'+tweet_id).onclick = '';
	
	new Ajax.Request(create, {
		method: 'post',
		parameters: { 'id': tweet_id, 'user': user, 'pass': pass },
		onSuccess: function(transport) {
			
			$('favorite_'+tweet_id).src = 'images/star-on.png';
			$('favorite_'+tweet_id).onclick = function(event) {
				destroy(tweet_id);
				Event.stop(event);
			}
			
		},
		onFailure: function() {
			alert('Unable to modify favorite.  Please try again later.')
			$('favorite_'+tweet_id).onclick = function(event) {
				create(tweed_id);
				Event.stop(event);
			}
		}
	});

}

function destroy(tweet_id) {

	var destroy = '/twitter/destroy.php';
	$('favorite_'+tweet_id).onclick = '';
	
	new Ajax.Request(destroy, {
		method: 'post',
		parameters: { 'id': tweet_id, 'user': user, 'pass': pass },
		onSuccess: function(transport) {
			
			$('favorite_'+tweet_id).src = 'images/star-off.png';
			$('favorite_'+tweet_id).onclick = function(event) {
				create(tweet_id);
				Event.stop(event);
			}
			
		},
		onFailure: function() {
			alert('Unable to modify favorite.  Please try again later.')
			$('favorite_'+tweet_id).onclick = function(event) {
				destroy(tweed_id);
				Event.stop(event);
			}
		}
	});

}

function update(message) {
	
	var update = '/twitter/update.php';
	
	new Ajax.Request(update, {
		method: 'post',
		parameters: { status: message, 'user': user, 'pass': pass },
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
		var user_a = Builder.node('a');
		user_a.href = 'http://twitter.com/' + tweet.user.screen_name + '/';
		user_a.target = '_blank';
		user_a.insert(image);
		
		var cell_image = Builder.node('td');
		cell_image.width = "48px";
		cell_image.insert(user_a);
		
		var cell_text  = Builder.node('td');
		
		var name = Builder.node('p');
		
		var star = Builder.node('img');
		star.id = "favorite_" + tweet.id;
		if (tweet.favorited) {
			star.src = 'images/star-on.png';
			star.onclick = function(event) {
				destroy(tweet.id);
				Event.stop(event);
			}
		} else {
			star.src = 'images/star-off.png';				
			star.onclick = function(event) {
				create(tweet.id);
				Event.stop(event);
			}
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
		text = text.replace(url, '<span onclick="openInNewWindow(\'$1\');" class="link">$1</span>');
		cell_text.insert('<p>' + text + '</p>');
				
		var at = Builder.node('p', tweet.created_at);
		at.addClassName('at');
		cell_text.insert(at);
		
		cell_text.onclick =
			function() {
			
				if (!link_clicked) {
			
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
					
				} else {
				
					link_clicked = false;
				
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
		
		var regexp_reply = new RegExp('\@' + user);
		
		if (tweet.text.match(regexp_reply)) {
			li.addClassName('reply');
		}
		
		// If the tweet has a higher id than we've seen, place it at the top
		// otherwise place it at the bottom
		if (tweet.id > maxid) {
			$('feed').insert({ top:li });
		} else {
			$('feed').insert(li);
		}
		
		// Update the maxid based on this tweet
		maxid = (tweet.id > maxid) ? tweet.id : maxid;
		
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


function openInNewWindow(url) {
	link_clicked = true;
	window.open(url);
}