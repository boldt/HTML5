
	var channel;

	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		if (event.candidate && !peerConnection.candidate) {
			peerConnection.candidate = event.candidate;
			localStorage.setItem("ice-local", JSON.stringify(event.candidate));
			trace('ICE candidate');
		}
	};
	trace('Created peer connection');

	//##########################################################################

	channel = peerConnection.createDataChannel("sendDataChannel", {reliable: false});
	channel.onopen = function () {
		var readyState = channel.readyState;
		trace('(12) Send channel state is: ' + readyState);

		var data = "Hallo from local!"
		channel.send(data);
		trace('(14) Sent data: ' + data);
	};
	channel.onclose = function () {
		var readyState = channel.readyState;
		trace('(20) Send channel state is: ' + readyState);
	};
	channel.onmessage = function (event) {
		trace('(15) Received message: ' + event.data);
	};
	trace('(03) Created send data channel');

	peerConnection.createOffer(function (desc) {
		peerConnection.setLocalDescription(desc);
		trace('(04) Offer from peerConnection');
		localStorage.setItem("offer-local", JSON.stringify(desc));
	});

	$('#offer-remote').click(function () {
		var desc = new SessionDescription(JSON.parse(localStorage.getItem("offer-remote")));
		peerConnection.setRemoteDescription(desc);

		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-remote")));
		peerConnection.addIceCandidate(candidate);
	});

	//##########################################################################

	$('#close').click(function () {
		channel.close();
		trace('(17) Closed data channel channel');
		peerConnection.close();
		trace('(19) Closed peer connections');
	});

