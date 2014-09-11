
var	servers = { "iceServers": [

	// FROM: http://stackoverflow.com/a/20134888/605890

	{url:'stun:stun01.sipphone.com'},
	{url:'stun:stun.ekiga.net'},
	{url:'stun:stun.fwdnet.net'},
	{url:'stun:stun.ideasip.com'},
	{url:'stun:stun.iptel.org'},
	{url:'stun:stun.rixtelecom.se'},
	{url:'stun:stun.schlund.de'},
	{url:'stun:stun.l.google.com:19302'},
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
	{
		url: 'turn:numb.viagenie.ca',
		credential: 'muazkh',
		username: 'webrtc@live.com'
	},
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
function handleConnection(peerConnection, sdp, ice) {
	// Set SDP
	sdp = new SessionDescription(JSON.parse(sdp));
	peerConnection.setRemoteDescription(sdp, function() {
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

