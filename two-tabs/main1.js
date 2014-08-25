
	var channel;

	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		if (event.candidate && !peerConnection.candidate) {
			peerConnection.candidate = event.candidate;
			localStorage.setItem("ice-remote", JSON.stringify(event.candidate));
			trace('ICE candidate');
		}
	};
	trace('Created peer connection');

	//##########################################################################

	peerConnection.ondatachannel = function (event) {
		trace('(05) Receive Channel Callback');
		channel = event.channel;
		channel.onmessage = function (event) {
			trace('(15) Received message: ' + event.data);
		};
		channel.onopen = function () {
			var readyState = channel.readyState;
			trace('(13) Receive channel state is: ' + readyState);

			var data = "Hallo from remote!"
			channel.send(data);
			trace('(14) Sent data: ' + data);
		};
		channel.onclose = function () {
			var readyState = channel.readyState;
			trace('(21) Receive channel state is: ' + readyState);
		};
	}

	$('#offer-local').click(function () {
		var desc = new SessionDescription(JSON.parse(localStorage.getItem("offer-local")));
		peerConnection.setRemoteDescription(desc);
		peerConnection.createAnswer(function (desc) {
			peerConnection.setLocalDescription(desc);
			trace('(07) Answer from peerConnection');
			localStorage.setItem("offer-remote", JSON.stringify(desc));
		});

		var candidate = new IceCandidate(JSON.parse(localStorage.getItem("ice-local")));
		peerConnection.addIceCandidate(candidate);

	});

	//##########################################################################

	$('#close').click(function () {
		channel.close();
		trace('(18) Closed data channel channel');
		peerConnection.close();
		trace('(19) Closed peer connections');
	});

