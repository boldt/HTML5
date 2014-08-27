var	servers = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
var constraints = { 'mandatory': { 'OfferToReceiveAudio': false, 'OfferToReceiveVideo': false } };

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
function handleConnection(peerConnection, sdp, ice) {
	// Set SDP
	sdp = new SessionDescription(JSON.parse(sdp));
	peerConnection.setRemoteDescription(sdp, function() {
		console.info("OK: setRemoteDescription")
	}, function(e) {
		console.error("ERROR: setRemoteDescription", e)
	});
	// Set ICE
	if(ice) {
		ice = new IceCandidate(JSON.parse(ice));
		peerConnection.addIceCandidate(ice);
	}
};

$('#close').click(function () {
	channel.close();
	trace('Channel: Closed');
	peerConnection.close();
	trace('Peer connection: Closed');
});

