var servers = null;

var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

var channel;

function trace(text) {
	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function createConnection() {

	peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		if (event.candidate && !peerConnection.candidate) {
			trace('(10) Remote ICE callback');
			peerConnection.candidate = event.candidate;
			localStorage.setItem("ice-remote", JSON.stringify(event.candidate));
			trace('(11) Remote ICE candidate');
		}
	};
	trace('(01) Created remote peer connection object peerConnection');

	peerConnection.ondatachannel = function (event) {
		trace('(05) Receive Channel Callback');
		channel = event.channel;
		channel.onmessage = function (event) {
			trace('(15) Received message: ' + event.data);
		};
		channel.onopen = handlechannelStateOnOpen;
		channel.onclose = handlechannelStateOnClose;
	}

	$('#offer-local').click(function () {
		var desc = new SessionDescription(JSON.parse(localStorage.getItem("offer-local")));
		peerConnection.setRemoteDescription(desc);

		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-local")));
		peerConnection.addIceCandidate(candidate);

		peerConnection.createAnswer(function (desc) {
			peerConnection.setLocalDescription(desc);
			trace('(07) Answer from peerConnection');
			localStorage.setItem("offer-remote", JSON.stringify(desc));
		});
	});

	$('#close').click(function () {
		channel.close();
		trace('(18) Closed data channel channel');
		peerConnection.close();
		trace('(19) Closed peer connections');
	});
}

function handlechannelStateOnOpen() {
	var readyState = channel.readyState;
	trace('(13) Receive channel state is: ' + readyState);

	var data = "Hallo from remote!"
	channel.send(data);
	trace('(14) Sent data: ' + data);
}

function handlechannelStateOnClose() {
	var readyState = channel.readyState;
	trace('(21) Receive channel state is: ' + readyState);
}

// Init
createConnection();

