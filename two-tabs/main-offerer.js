
	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		data.ice = event.candidate;
		trace('ICE: Created');
		localStorage.setItem("data-local", JSON.stringify(data));
		peerConnection.onicecandidate = null;
	};
	trace('Peer connection: Created');

	channel = peerConnection.createDataChannel("sendDataChannel", {reliable: true});
	trace('Channel: created');
	handleChannel(channel);

	peerConnection.createOffer(function (offer) {
		trace('Session (offer): Created');
		peerConnection.setLocalDescription(offer);
		data.session = offer;
	});

	$('#get').click(function () {
		handleConnection(peerConnection, JSON.parse(localStorage.getItem("data-remote")));
	});
