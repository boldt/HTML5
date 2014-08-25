var servers = null;

var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

function trace(text) {
  	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}

function handleChannel(channel) {
	channel.onopen = function () {
		var readyState = channel.readyState;
		trace('Channel state is: ' + readyState);

		var data = "Hello World!"
		trace('Sent data: ' + data);
		channel.send(data);
	};
	channel.onclose = function () {
		var readyState = channel.readyState;
		trace('Channel state is: ' + readyState);
	};
	channel.onmessage = function (event) {
		trace('Channel received message: ' + event.data);
	};
	trace('Created channel');
}
