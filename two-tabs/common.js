var	servers = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };

var channel;
var data = {};

var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

function trace(text) {
  	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
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
function handleConnection(peerConnection, data) {
	peerConnection.setRemoteDescription(new SessionDescription(data.session));
	if(data.ice) {
		peerConnection.addIceCandidate(new IceCandidate(data.ice));
	}
};

$('#close').click(function () {
	channel.close();
	trace('Channel: Closed');
	peerConnection.close();
	trace('Peer connection: Closed');
});

