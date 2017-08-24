var base = 'coturn.dennis-boldt.de';
var	servers = { "iceServers": 
	[
		{
			url: 'stun:' + base + ':3478'
		}/*, {
			url: 'turn:' + base + ':3478',
			credential: '',
			username: ''
		}*/
	]
};

//var constraints = { 'mandatory': { 'OfferToReceiveAudio': false, 'OfferToReceiveVideo': false } };
var constraints;

var channel;
var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

function trace(text) {
	var msg = (performance.now() / 1000).toFixed(3) + ": " + text;
	$('#log').html(msg + "\n" + $('#log').html());
};

function handleChannel(channel) {

	channel.onopen = function () {
		trace('Channel: Opened');

		var data = "Hello World!"
		trace('Channel: send message: ' + data);
		channel.send(data);
	};

	channel.onclose = function () {
		trace('Channel: Closed');
	};

	channel.onmessage = function (event) {
		trace('Channel: received message: ' + event.data);
	};
};

/*
 * Sets the SDP and the ICE
 */
function handleRemoteDescription(peerConnection, sdp, cb) {
	// Set SDP
	sdp = new SessionDescription(JSON.parse(sdp));
	peerConnection.setRemoteDescription(sdp, cb, function(e) {
		console.error("ERROR: setRemoteDescription", e)
	});
};

function handleIceCandidates(iceCandidates) {
	// Set ICE
	if(iceCandidates) {
		iceCandidates = JSON.parse(iceCandidates);
		for(var i = 0; i < iceCandidates.length; i++) {
			var ice = new IceCandidate(iceCandidates[i]);
			peerConnection.addIceCandidate(ice);
		}
	}
}

$('#close').click(function () {
	channel.close();
	trace('Channel: Closed');
	peerConnection.close();
	trace('Peer connection: Closed');
});

// Borrowed from
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/trickle-ice/js/main.js
function parseCandidate(text) {
  var candidateStr = 'candidate:';
  var pos = text.indexOf(candidateStr) + candidateStr.length;
  var fields = text.substr(pos).split(' ');
  return {
    'component': fields[1],
    'type': fields[7],
    'foundation': fields[0],
    'protocol': fields[2],
    'address': fields[4],
    'port': fields[5],
    'priority': formatPriority(fields[3])
  };
}

// Borrowed from
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/trickle-ice/js/main.js
// Parse the uint32 PRIORITY field into its constituent parts from RFC 5245,
// type preference, local preference, and (256 - component ID).
// ex: 126 | 32252 | 255 (126 is host preference, 255 is component ID 1)
function formatPriority(priority) {
  var s = '';
  s += (priority >> 24);
  s += ' | ';
  s += (priority >> 8) & 0xFFFF;
  s += ' | ';
  s += priority & 0xFF;
  return s;
}


// Based on https://stackoverflow.com/a/23212379
var i, checkboxes = document.querySelectorAll('input[type=checkbox]');
function save_rb() {
	for (i = 0; i < checkboxes.length; i++) {
		localStorage.setItem(checkboxes[i].id, checkboxes[i].checked);
	}
}

function load_rb() {
	for (i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = localStorage.getItem(checkboxes[i].id) === 'true' ? true : false;
	}
}
load_rb();

