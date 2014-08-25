var servers = null;

window.RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;

var sendChannel, receiveChannel;

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function createConnection() {

	remotePeerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	remotePeerConnection.onicecandidate = function (event) {
		if (event.candidate && !remotePeerConnection.candidate) {
			trace('(10) Remote ICE callback');
			remotePeerConnection.candidate = event.candidate;
			localPeerConnection.addIceCandidate(event.candidate);
			trace('(11) Remote ICE candidate');
//			trace('(11) Remote ICE candidate: \n ' + event.candidate.candidate);
		}
	};
	remotePeerConnection.ondatachannel = function (event) {
		trace('(05) Receive Channel Callback');
		receiveChannel = event.channel;
		receiveChannel.onmessage = function (event) {
			trace('(15) Received message: ' + event.data);
			closeDataChannels();
		};
		receiveChannel.onopen = handleReceiveChannelStateOnOpen;
		receiveChannel.onclose = handleReceiveChannelStateOnClose;
	}
	trace('(01) Created remote peer connection object remotePeerConnection');

	localPeerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	localPeerConnection.onicecandidate = function (event) {
		if (event.candidate && !localPeerConnection.candidate) {
			trace('(08) Local ICE callback');
			localPeerConnection.candidate = event.candidate;
			remotePeerConnection.addIceCandidate(event.candidate);
			trace('(09) Local ICE candidate');
//			trace('(09) Local ICE candidate: \n' + event.candidate.candidate);
		}
	};
	trace('(02) Created local peer connection object localPeerConnection');

	sendChannel = localPeerConnection.createDataChannel("sendDataChannel", {reliable: false});
	sendChannel.onopen = handleSendChannelStateOnOpen;
	sendChannel.onclose = handleSendChannelStateOnClose;
	trace('(03) Created send data channel');

	localPeerConnection.createOffer(function (desc) {
		localPeerConnection.setLocalDescription(desc);
		trace('(04) Offer from localPeerConnection');
		//  trace('Offer from localPeerConnection \n' + desc.sdp);
		remotePeerConnection.setRemoteDescription(desc);
		remotePeerConnection.createAnswer(function (desc) {
			remotePeerConnection.setLocalDescription(desc);
			trace('(07) Answer from remotePeerConnection');
			//  trace('Answer from remotePeerConnection \n' + desc.sdp);
			localPeerConnection.setRemoteDescription(desc);
		});
	});
}

function closeDataChannels() {
	trace('(16) Closing data channels');
	sendChannel.close();
	trace('(17) Closed data channel sendChannel');
	receiveChannel.close();
	trace('(18) Closed data channel receiveChannel');
	localPeerConnection.close();
	remotePeerConnection.close();
	localPeerConnection = null;
	remotePeerConnection = null;
	trace('(19) Closed peer connections');
}

function handleSendChannelStateOnOpen() {
	var readyState = sendChannel.readyState;
	trace('(12) Send channel state is: ' + readyState);
}

function handleSendChannelStateOnClose() {
	var readyState = sendChannel.readyState;
	trace('(20) Send channel state is: ' + readyState);
}


function handleReceiveChannelStateOnOpen() {
	var readyState = receiveChannel.readyState;
	trace('(13) Receive channel state is: ' + readyState);

	var data = "Hallo!"
	sendChannel.send(data);
	trace('(14) Sent data: ' + data);
}

function handleReceiveChannelStateOnClose() {
	var readyState = receiveChannel.readyState;
	trace('(21) Receive channel state is: ' + readyState);
}

// Init
createConnection();
