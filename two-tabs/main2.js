
	var channel;

	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		trace('Created ICE');
		localStorage.setItem("ice-local", JSON.stringify(event.candidate));
		peerConnection.onicecandidate = null;
	};
	trace('Created peer connection');

	//##########################################################################

	channel = peerConnection.createDataChannel("sendDataChannel", {reliable: true});
	handleChannel(channel);

	peerConnection.createOffer(function (offer) {
		peerConnection.setLocalDescription(offer);
		trace('Created offer');
		localStorage.setItem("offer-local", JSON.stringify(offer));
	});

	$('#offer-remote').click(function () {
		var offer = new SessionDescription(JSON.parse(localStorage.getItem("offer-remote")));
		peerConnection.setRemoteDescription(offer);

		trace("Add ICE candidate")
		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-remote")));
		peerConnection.addIceCandidate(candidate);
	});

	//##########################################################################

	$('#close').click(function () {
		channel.close();
		trace('(17) Closed data channel');
		peerConnection.close();
		trace('(19) Closed peer connections');
	});

