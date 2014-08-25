var servers = null;

var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

var localChannel;

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function createConnection() {

	localPeerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	localPeerConnection.onicecandidate = function (event) {
		if (event.candidate && !localPeerConnection.candidate) {
			trace('(08) Local ICE callback');
			localPeerConnection.candidate = event.candidate;
			localStorage.setItem("ice-local", JSON.stringify(event.candidate));
			trace('(09) Local ICE candidate');
		}
	};
	trace('(02) Created local peer connection object localPeerConnection');
	localChannel = localPeerConnection.createDataChannel("sendDataChannel", {reliable: false});
	localChannel.onopen = handlelocalChannelStateOnOpen;
	localChannel.onclose = handlelocalChannelStateOnClose;
	localChannel.onmessage = function (event) {
		trace('(15) Received message: ' + event.data);
	};
	trace('(03) Created send data channel');

	localPeerConnection.createOffer(function (desc) {
		localPeerConnection.setLocalDescription(desc);
		trace('(04) Offer from localPeerConnection');
		localStorage.setItem("offer-local", JSON.stringify(desc));
	});

	$('#offer-remote').click(function () {
		var desc = new SessionDescription(JSON.parse(localStorage.getItem("offer-remote")));
		localPeerConnection.setRemoteDescription(desc);

		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-remote")));
		localPeerConnection.addIceCandidate(candidate);
	});

	$('#close').click(function () {
		localChannel.close();
		trace('(17) Closed data channel localChannel');
		localPeerConnection.close();
		trace('(19) Closed peer connections');
	});

}

function handlelocalChannelStateOnOpen() {
	var readyState = localChannel.readyState;
	trace('(12) Send channel state is: ' + readyState);

	var data = "Hallo from local!"
	localChannel.send(data);
	trace('(14) Sent data: ' + data);
}

function handlelocalChannelStateOnClose() {
	var readyState = localChannel.readyState;
	trace('(20) Send channel state is: ' + readyState);
}

// Init
createConnection();
