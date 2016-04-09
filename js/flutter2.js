/*
 * http://twitter.com/statuses/public_timeline.json
 * http://twitter.com/statuses/friends_timeline.json
 * http://twitter.com/direct_messages.json
 * http://twitter.com/statuses/update.json
 *
 */
 
var ids        = new Array();
var tweet_list = new Array();

var updating = false;
var active_updates = 0;
var link_clicked = false;
var tweet_status = '';

var queue_friends = new Array();
var queue_directs = new Array();
var queue_sent    = new Array();

var page_friends = 0;
var page_directs = 0;
var page_sent    = 0;

var silenced     = false;

var user = '';
var pass = '';

var url_friends_timeline = 'twitter.com/statuses/user_timeline.json';

function refresh() {

	var prefs = new _IG_Prefs();
	user = prefs.getString("user");
	pass = prefs.getString("pass");
	
	fetchData();
	
	// url_friends_timeline = "https://" + user + ":" + pass + "@" + url_friends_timeline;
	// url_friends_timeline = "http://www.jbmorley.co.uk";

	/*
	setup_events();	
	fetch_tweets_if_necessary();
	setTimeout('update_tweets();', 300000);	
	*/

}

function fetchData() {

	var url = "https://twitter.com/statuses/user_timeline.json";
	
	var params = {};
	params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
	params[gadgets.io.RequestParameters.AUTHORIZATION] = gadgets.io.AuthorizationType.OAUTH;
	params[gadgets.io.RequestParameters.OAUTH_SERVICE_NAME] = 'twitter';
	params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;

	gadgets.io.makeRequest(url, function (response) { 
	
		alert(response);
	
 		if (response.oauthApprovalUrl) {
			alert ("APPROVAL URL");
    	
			// Create the popup handler. The onOpen function is called when the user
			// opens the popup window. The onClose function is called when the popup
			// window is closed.
			var popup = shindig.oauth.popup({
				destination: response.oauthApprovalUrl,
				windowOptions: null,
				onOpen: function() { showOneSection('waiting'); },
				onClose: function() { fetchData(); }
			});

			// Use the popup handler to attach onclick handlers to UI elements.  The
			// createOpenerOnClick() function returns an onclick handler to open the
			// popup window.  The createApprovedOnClick function returns an onclick 
			// handler that will close the popup window and attempt to fetch the user's
			// data again.
			var personalize = document.getElementById('personalize');
			personalize.onclick = popup.createOpenerOnClick();
			var approvaldone = document.getElementById('approvaldone');
			approvaldone.onclick = popup.createApprovedOnClick();

		} else if (response.data) {
		
			alert(response.data);
			
		} else {

			// The response.oauthError and response.oauthErrorText values may help debug
			// problems with your gadget.
			// var main = document.getElementById('main');
			var err = document.createTextNode('OAuth error: ' + response.oauthError + ': ' + response.oauthErrorText);
			main.appendChild(err);
			
		}
	}, params);
	
}



function update_tweets() {
	//friends_timeline(1);
	//direct_messages(1);
	//sent(1);
}


function fetch_tweets_if_necessary() {

	// Make sure all the tweet buckets have enough
	// contents.
	
	// When each of the updates is completed, it will
	// call display_tweets.  This will successfully run
	// when there are no outstanding updates and will
	// interlace all the current tweets to the UI.

	if (queue_friends.length < 20) {
		page_friends++;
		friends_timeline(page_friends);
	}
	
	if (queue_directs.length < 20) {
		page_directs++;
		// direct_messages(page_directs);
	}
	
	if (queue_sent.length < 20) {
		page_sent++;
		// sent(page_sent);
	}
	
}

function date_to_count(date) {

	// Sat Mar 14 07:40:14 +0000 2008
	// 012345678911111111112222222222
	//           01234567890123456789

	var month  = date.substring(4, 7);
	var day    = date.substring(8, 10);
	var hour   = date.substring(11, 13);
	var minute = date.substring(14, 16);
	var second = date.substring(17, 19);
	var year   = date.substring(26, 30);
	
	var offset_h = date.substring(21, 23);
	var offset_m = date.substring(23, 25);
	var type     = date.substring(20, 21);
	
	if (month == 'Jan') {
		month = "00";
	} else if (month == 'Feb') {
		month = "01";	
	} else if (month == 'Mar') {
		month = "02";
	} else if (month == 'Apr') {
		month = "03";
	} else if (month == 'May') {
		month = "04";
	} else if (month == 'Jun') {
		month = "05";
	} else if (month == 'Jul') {
		month = "06";
	} else if (month == 'Aug') {
		month = "07";
	} else if (month == 'Sep') {
		month = "08";
	} else if (month == 'Oct') {
		month = "09";
	} else if (month == 'Nov') {
		month = "10";
	} else if (month == 'Dec') {
		month = "11";
	}
	
	var d = new Date();
	d.setYear(year);
	d.setMonth(month);
	d.setDate(day);
	d.setHours(hour);
	d.setMinutes(minute);
	d.setSeconds(second);
	
	// Time zone correction
	if (type == '-') {
		offset_h *= -1;
		offset_m *= -1;
	}
    d.add({ hour: offset_h, minute: offset_m });
	
	return d.valueOf();
}

function display_tweets() {

	while (queue_friends.length > 0) {
		add(queue_friends.shift());
	}
	
	var earliest = tweet_list[tweet_list.length-1].time;
	
	while ((queue_directs.length > 0) && (date_to_count(queue_directs[0].created_at) > earliest)) {
		add(queue_directs.shift());
	}
	
	while ((queue_sent.length > 0) && (date_to_count(queue_sent[0].created_at) > earliest)) {
		add(queue_sent.shift());
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
  		
  		// IE Specific Behaviour
  		if (navigator.userAgent.indexOf('MSIE') != -1) {
	  		var scroll = document.viewport.getScrollOffsets().top;
	  		$('write_super').style.top = scroll + 'px';
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
		url_friends_timeline,
		page,
		function(result) {
			for (var i=0; i<result.length; i++) {
				queue_friends.push(result[i]);
			}
			display_tweets();
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
		}
	);
}


function sent(page) {
	fetch(
		'/twitter/sent.php',
		page,
		function(result) {
			for (var i=0; i<result.length; i++) {
				queue_sent.push(result[i]);
			}
			display_tweets();
		}
	);
}


function silence(message) {

	silenced = true;
	
	var tr = Builder.node('tr');
	tr.insert(Builder.node('td', message));
	
	var table = Builder.node('table', Builder.node('tbody', tr));

	var li = Builder.node('li');
	li.insert(table);
	li.addClassName('fail');
	
	$('feed').insert({ top: li });
	
	updating = false;
	$('ld').style.display = 'none';
	
}


function makeCachedRequest(url, callback, params, refreshInterval) {
	var ts = new Date().getTime();
	var sep = "?";
	if (refreshInterval && refreshInterval > 0) {
		ts = Math.floor(ts / (refreshInterval * 1000));
	}
	if (url.indexOf("?") > -1) {
		sep = "&";
	}
	url = [ url, sep, "nocache=", ts ].join("");
	gadgets.io.makeRequest(url, callback, params);
}


function fetch(url, page, fn) {
	
	active_updates++;
	updating = true;
	$('ld').style.display = 'block';
	var fetch = url;

	fetch += "&page=1";
	alert(fetch);
	makeCachedRequest(fetch, function(results) { alert(results.text); /* data, text */ }, {}, 0 );
	

	
	/*
	new Ajax.Request(fetch,
	  {
		method:'get',
		parameters: { 'user': user, 'pass': pass, 'page': page },
		onSuccess: function(transport) {
			if (!silenced) {
				if (transport.responseText.substring(0, 6) == '<br />') {
					silence('Unable to fetch tweets for \'' + user + '\'.  Please check your username and password and refresh the page.');
				} else {
				
					var result = interpret(transport.responseText);
					
					active_updates--;
					if (active_updates < 1) {
						updating = false;
						$('ld').style.display = 'none';
					}
		
					fn(result);
					
				}
			}
		},
		onFailure: function() {
			if (!silenced) {
				alert('Unable to query Twitter.  Please try again later.');
				
				active_updates--;
				if (active_updates < 1) {
					updating = false;
					$('ld').style.display = 'none';
				}
			}
			
		}
	  });
	 */
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
			
			$('new_tweet').value = '';
			$('new_tweet').removeClassName('updating');
			$('remaining').update('140');
			$('remaining').removeClassName('error');
			$('remaining').removeClassName('warning');
			update_color();
			
			add(interpret(transport.responseText));
			setTimeout('update_tweets();', 15000);
			
		},
		onFailure: function() {
			alert('Unable to post to Twitter.  Please try again later.')
		}
	});
}

function add(tweet) {
	
	var tweet_time = date_to_count(tweet.created_at);
	
	if (ids[tweet.id] != 1) {
	
		ids[tweet.id] = 1;
		
		var profile_image_url = '';
		var screen_name = '';
		var user_name = '';
		var direct = false;

		// Handle direct messages!
		if (tweet.user == undefined) {
			profile_image_url = tweet.sender.profile_image_url;
			screen_name = tweet.sender_screen_name;
			user_name = "Direct from " + tweet.sender.name;
			if (screen_name == user) {
				user_name = "Direct to " + tweet.recipient.name;
			}
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
		cell_text.addClassName('text');
		
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
		text = text.replace(/(http:\/\/\S+[^\(^\)^\.^\s]+)/g, '<span onclick="openInNewWindow(\'$1\');" class="link">$1</span>');
		text = text.replace(/(@([^\(^\)^\.^\s]+))/g, '<span onclick="openInNewWindow(\'http://www.twitter.com/$2\');" class="link">$1</span>');

		// Actually set the text.
		cell_text.insert('<p>' + text + '</p>');		
		
		var created_at = tweet.created_at;
		created_at = created_at.substring(0, created_at.length-14);
		var at = Builder.node('p', created_at);
		
		at.addClassName('at');
		cell_text.insert(at);
		
		cell_text.onclick = function() { tweet_clicked(screen_name, direct); }
		
		var row_layout = Builder.node('tr');
		row_layout.insert(cell_image);
		row_layout.insert(cell_text);
		
		var table_layout = Builder.node('table', Builder.node('tbody', row_layout));
		
		var tweet_container = Builder.node('div', table_layout);
		tweet_container.addClassName('tweet_container');
	
		var li = Builder.node('li');
		li.id = 'tweet'+tweet.id;
		li.insert(tweet_container);
		
		// Reply
		
		var regexp_reply = new RegExp('@' + user);
		
		if (tweet.text.match(regexp_reply)) {
			li.addClassName('reply');
		}
		
		if (direct) {
			li.addClassName('direct');
		}
		
		// If the tweet has a lower id than the minimum, then place it at the bottom
		// If it has a higher one, place it at the top
		// If not, we need to pick an end and work in
		if (tweet_list.length < 1) {
			
			// Just insert it as it's the first
			$('feed').insert(li);
			tweet_list.push({ time:tweet_time, id:tweet.id });
			
		} else if (tweet_time < (tweet_list[tweet_list.length-1]).time) {
			
			// Place at the bottom
			$('feed').insert(li);
			tweet_list.push({ time:tweet_time, id:tweet.id });
			
		} else if (tweet_time > tweet_list[0].time) {
		
			// Place at the top
			$('feed').insert({ top: li });
			tweet_list.unshift({ time:tweet_time, id:tweet.id });
			
		} else {

			// Insert it at the correct place in the list
			var idx = find_target_id(tweet_list, tweet_time);
			$('tweet'+tweet_list[idx].id).insert({ after: li });
			tweet_list.splice(idx, 0, { time:tweet_time, id:tweet.id });
		
		}
		
	}

}

function find_target_id(list, time) {
	for (var i=0; i<list.length; i++) {
		if (list[i].time < time) {
			return i;
		}
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