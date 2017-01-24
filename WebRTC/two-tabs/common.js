
var	servers = { "iceServers": [
	// Sources:
	//
	// http://stackoverflow.com/a/20134888/605890
	// https://gist.github.com/yetithefoot/7592580
	{url:'stun:stun.l.google.com:19302'},

/*
	{url:'stun:stun01.sipphone.com'},
	{url:'stun:stun.ekiga.net'},
	{url:'stun:stun.fwdnet.net'},
	{url:'stun:stun.ideasip.com'},
	{url:'stun:stun.iptel.org'},
	{url:'stun:stun.rixtelecom.se'},
	{url:'stun:stun.schlund.de'},
	{url:'stun:stun1.l.google.com:19302'},
	{url:'stun:stun2.l.google.com:19302'},
	{url:'stun:stun3.l.google.com:19302'},
	{url:'stun:stun4.l.google.com:19302'},

	{url:'stun:stunserver.org'},
	{url:'stun:stun.softjoys.com'},
	{url:'stun:stun.voiparound.com'},
	{url:'stun:stun.voipbuster.com'},
	{url:'stun:stun.voipstunt.com'},
	{url:'stun:stun.voxgratia.org'},
	{url:'stun:stun.xten.com'},
*/
	{
		url: 'turn:numb.viagenie.ca',
		credential: 'muazkh',
		username: 'webrtc@live.com'
	}
/*
	{
		url: 'turn:192.158.29.39:3478?transport=udp',
		credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
		username: '28224511:1379330808'
	},
	{
		url: 'turn:192.158.29.39:3478?transport=tcp',
		credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
		username: '28224511:1379330808'
	}
*/
] };

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