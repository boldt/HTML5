
	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});
	peerConnection.onicecandidate = function (event) {
		data.ice = event.candidate;
		trace('ICE: Created');
		localStorage.setItem("data-remote", JSON.stringify(data));
		peerConnection.onicecandidate = null;
	};
	trace('Peer connection: Created');

	peerConnection.ondatachannel = function (event) {
		trace('Channel: created');
		channel = event.channel;
		handleChannel(channel);
	};

	$('#get').click(function () {
		handleConnection(peerConnection, JSON.parse(localStorage.getItem("data-local")));
		peerConnection.createAnswer(function (answer) {
			trace('Session (answer): Created');
			peerConnection.setLocalDescription(answer);
			data.session = answer;
		});
	});

