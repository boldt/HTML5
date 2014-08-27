
	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});

	// Fired if the ICE gathering is complete
	// @see: http://stackoverflow.com/a/25489506/605890
	peerConnection.onicecandidate = function (event) {
		trace('ICE: Created');
		data.ice = event.candidate;
		localStorage.setItem("data-local", JSON.stringify(data));
		peerConnection.onicecandidate = null;
	};
	trace('Peer connection: Created');

	channel = peerConnection.createDataChannel("sendDataChannel", {reliable: true});
	trace('Channel: created');
	handleChannel(channel);

	peerConnection.createOffer(
		function (offer) {
		trace('Session (offer): Created');
		peerConnection.setLocalDescription(offer);
		data.session = offer;
		console.log(offer);
		}, function (code) {
    		console.error("Error: " + code);
  		}
	);

	$('#get').click(function () {
		handleConnection(peerConnection, JSON.parse(localStorage.getItem("data-remote")));
	});
