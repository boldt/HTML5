var servers = null;

var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;

function trace(text) {
  	console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}
