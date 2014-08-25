var servers = null;

var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

var remoteChannel;

function trace(text) {
	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function createConnection() {

	remotePeerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	remotePeerConnection.onicecandidate = function (event) {
		if (event.candidate && !remotePeerConnection.candidate) {
			trace('(10) Remote ICE callback');
			remotePeerConnection.candidate = event.candidate;
			localStorage.setItem("ice-remote", JSON.stringify(event.candidate));
			trace('(11) Remote ICE candidate');
		}
	};
	trace('(01) Created remote peer connection object remotePeerConnection');

	remotePeerConnection.ondatachannel = function (event) {
		trace('(05) Receive Channel Callback');
		remoteChannel = event.channel;
		remoteChannel.onmessage = function (event) {
			trace('(15) Received message: ' + event.data);
		};
		remoteChannel.onopen = handleremoteChannelStateOnOpen;
		remoteChannel.onclose = handleremoteChannelStateOnClose;
	}

	$('#offer-local').click(function () {
		var desc = new SessionDescription(JSON.parse(localStorage.getItem("offer-local")));
		remotePeerConnection.setRemoteDescription(desc);

		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-local")));
		remotePeerConnection.addIceCandidate(candidate);

		remotePeerConnection.createAnswer(function (desc) {
			remotePeerConnection.setLocalDescription(desc);
			trace('(07) Answer from remotePeerConnection');
			localStorage.setItem("offer-remote", JSON.stringify(desc));
		});
	});

	$('#close').click(function () {
		remoteChannel.close();
		trace('(18) Closed data channel remoteChannel');
		remotePeerConnection.close();
		trace('(19) Closed peer connections');
	});
}

function handleremoteChannelStateOnOpen() {
	var readyState = remoteChannel.readyState;
	trace('(13) Receive channel state is: ' + readyState);

	var data = "Hallo from remote!"
	remoteChannel.send(data);
	trace('(14) Sent data: ' + data);
}

function handleremoteChannelStateOnClose() {
	var readyState = remoteChannel.readyState;
	trace('(21) Receive channel state is: ' + readyState);
}

// Init
createConnection();

