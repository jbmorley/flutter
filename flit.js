/*
 * http://twitter.com/statuses/public_timeline.json
 * http://twitter.com/statuses/friends_timeline.json
 * http://twitter.com/direct_messages.json
 * http://twitter.com/statuses/update.json
 *
 */
 
var maxid = 0;
var ids = new Array();
var updating = false;
var active_updates = 0;
var link_clicked = false;
var tweet_status = '';

var queue_friends = new Array();
var queue_directs = new Array();

var page_friends = 0;
var page_directs = 0;

function refresh() {
	setup_events();	
	fetch_tweets_if_necessary();
}


function fetch_tweets_if_necessary() {

	// Make sure all the tweet buckets have enough
	// contents.
	
	// When each of the updates is completed, it will
	// call display_tweets.  This will successfully run
	// when there are no outstanding updates and will
	// interlace all the current tweets to the UI.

	if (queue_friends.length < 1) {
		page_friends++;
		friends_timeline(page_friends);
	}
	
	if (queue_directs.length < 1) {
		page_directs++;
		direct_messages(page_directs);
	}
	
}

function display_tweets() {

	if (active_updates < 1) {
	
		// Attempt to re-thread the tweets.
		var count_friends = 0;
		var count_directs = 0;
		
		while (count_friends < queue_friends.length) {
		
			add(queue_friends[count_friends]);
			count_friends++;
		
		}

	}
	

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
  			page_friends++;
  			friends_timeline(page_friends);
  		}
 
	});
	
	$('new_tweet').observe('keyup', function(event) { 
		update_color();
		update_remaining();
	});

	$('new_tweet').observe('keydown', function(event) {
		var left = update_remaining();
		if (event.keyCode == Event.KEY_RETURN) {
			Event.stop(event);
			if (left >= -1) {
				$('new_tweet').addClassName('updating');
				update($('new_tweet').value);
			}
		} else {
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

function friends_timeline(page) {
	fetch(
		'/twitter/friends_timeline.php',
		page,
		function(result) {
			for (var i=0; i<result.length; i++) {
				queue_friends.push(result[i]);
			}
			display_tweets();
			// TODO Do this with a periodic.
			setTimeout('friends_timeline(1);', 300000);
		}
	);
}

function direct_messages(page) {
	fetch(
		'/twitter/direct_messages.php',
		page,
		function(result) {
			for (var i=0; i<result.length; i++) {
				queue_directs.push(result[i]);
			}
			display_tweets();
			// TODO Do this with a periodic.
			setTimeout('direct_messages(1);', 300000);
		}
	);
}


function fetch(url, page, fn) {
	
	active_updates++;
	updating = true;
	$('ld').style.display = 'block';
	var fetch = url + '?page=' + page;
	
	new Ajax.Request(fetch,
	  {
		method:'post',
		parameters: { 'user': user, 'pass': pass },
		onSuccess: function(transport) {
			var result = interpret(transport.responseText);
			
			active_updates--;
			if (active_updates < 1) {
				updating = false;
				$('ld').style.display = 'none';
			}

			fn(result);			
		},
		onFailure: function() {
			alert('Unable to query Twitter.  Please try again later.');
			
			active_updates--;
			if (active_updates < 1) {
				updating = false;
				$('ld').style.display = 'none';
			}
			
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
			
			$('new_tweet').value = '';
			$('new_tweet').removeClassName('updating');
			$('remaining').update('140');
			$('remaining').removeClassName('error');
			$('remaining').removeClassName('warning');
			update_color();
			
		},
		onFailure: function() {
			alert('Unable to post to Twitter.  Please try again later.')
		}
	});
}

function add(tweet) {
	
	if (ids[tweet.id] != 1) {
	
		ids[tweet.id] = 1;
		
		var profile_image_url = '';
		var screen_name = '';
		var user_name = '';
		var direct = false;

		// Handle direct messages!
		if (tweet.user == undefined) {
			profile_image_url = "http://s3.amazonaws.com/twitter_production/profile_images/20443772/user4_normal.jpg";
			profile_image_url = tweet.sender.profile_image_url;
			screen_name = tweet.sender_screen_name;
			user_name = "Direct from " + tweet.sender.name;
			direct = true;
		} else {
			profile_image_url = tweet.user.profile_image_url;
			screen_name = tweet.user.screen_name;
			user_name = tweet.user.name;
		}
		
		var image = Builder.node('img');
		image.src = profile_image_url;
		image.addClassName('profile');
		var user_a = Builder.node('a');
		user_a.href = 'http://twitter.com/' + screen_name + '/';
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
		name.insert(user_name);
		name.addClassName('name');
		cell_text.insert(name);
		
		// Replace links
		var text = tweet.text;
		var url  = new RegExp('(http://\\S+[^\\.^\\s]+)');
		text = text.replace(url, '<span onclick="openInNewWindow(\'$1\');" class="link">$1</span>');
		cell_text.insert('<p>' + text + '</p>');
		
		var created_at = tweet.created_at;
		created_at = created_at.substring(0, created_at.length-11);
		var at = Builder.node('p', created_at);
		
		at.addClassName('at');
		cell_text.insert(at);
		
		cell_text.onclick = function() { tweet_clicked(screen_name, direct); }
		
		var row_layout = Builder.node('tr');
		row_layout.insert(cell_image);
		row_layout.insert(cell_text);
		
		var table_layout = Builder.node('table');
		table_layout.insert(row_layout);
	
		var li = Builder.node('li');
		li.insert(table_layout);
		
		// Reply
		
		var regexp_reply = new RegExp('@' + user);
		
		if (tweet.text.match(regexp_reply)) {
			li.addClassName('reply');
		}
		
		if (direct) {
			li.addClassName('direct');
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

function set_tweet_type(type) {

	if (tweet_status != type) {
		$('new_tweet').removeClassName(tweet_status);
		tweet_status = type;
		
		if (type != '') {
			$('new_tweet').addClassName(type);
		}
		
	}

}

function update_color() {
	var new_tweet = $('new_tweet').value;
	
	if (new_tweet.match(new RegExp('^@'))) {
		set_tweet_type('reply');
	} else if (new_tweet.match(new RegExp('^\d '))) {
		set_tweet_type('direct');
	} else {
		set_tweet_type('');
	}

}

function update_remaining() {
	var left = 140 - ($('new_tweet').value.length);
	$('remaining').update(left);
	return left;
}

function tweet_clicked(screen_name, is_direct) {

	if (!link_clicked) {

		var new_tweet = $('new_tweet');
		var value = new_tweet.value;
		if ((value == "")
			|| (value.match(new RegExp('^@[^\\s]+ $')))
			|| (value.match(new RegExp('^d [^\\s]+ $')))) {

			var reply  = "@" + screen_name + " ";
			var direct = "d " + screen_name + " ";
			
			// A bit of a hack - switch the order for direct messages
			if (is_direct) {
				reply  = "d " + screen_name + " ";
				direct = "@" + screen_name + " ";
			}
			
			if (new_tweet.value != reply) {
				new_tweet.value = reply;
				new_tweet.activate();
				doSetCaretPosition(new_tweet, reply.length);
			} else if (new_tweet.value == reply) {
				new_tweet.value = direct;
				new_tweet.activate();
				doSetCaretPosition(new_tweet, direct.length);
			}
			
			update_color();
		
		}
		
	} else {
	
		link_clicked = false;
	
	}


}