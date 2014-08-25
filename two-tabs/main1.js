
	var channel;

	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		trace('Created ICE');
		localStorage.setItem("ice-remote", JSON.stringify(event.candidate));
		peerConnection.onicecandidate = null;
	};
	trace('Created peer connection');

	//##########################################################################

	peerConnection.ondatachannel = function (event) {
		trace('(05) Receive Channel Callback');
		channel = event.channel;
		handleChannel(channel);
	}

	$('#offer-local').click(function () {
		var offer = new SessionDescription(JSON.parse(localStorage.getItem("offer-local")));
		peerConnection.setRemoteDescription(offer);

		trace("Add ICE candidate")
		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-local")));
		peerConnection.addIceCandidate(candidate);

		peerConnection.createAnswer(function (answer) {
			trace('Created answer');
			peerConnection.setLocalDescription(answer);
			localStorage.setItem("offer-remote", JSON.stringify(answer));

		});
	});

	//##########################################################################

	$('#close').click(function () {
		channel.close();
		trace('(18) Closed data channel');
		peerConnection.close();
		trace('(19) Closed peer connections');
	});

