
	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});

	// Fired if the ICE gathering is complete
	// @see: http://stackoverflow.com/a/25489506/605890
	peerConnection.onicecandidate = function (event) {
		trace('ICE: Created');
		if(event.candidate) {
			$("#ice-offerer").val(JSON.stringify(event.candidate));
		}
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
		$("#sdp-offerer").val(JSON.stringify(offer));
		}, function (code) {
    		console.error("Error: " + code);
  		}
	);

	$('#get').click(function () {
		handleConnection(peerConnection, $("#sdp-answerer").val(), $("#ice-answerer").val());
	});
