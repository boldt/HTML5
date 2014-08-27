
	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});

	// Fired if the ICE gathering is complete
	// @see: http://stackoverflow.com/a/25489506/605890
	peerConnection.onicecandidate = function (event) {
		trace('ICE: Created');
		data.ice = event.candidate;
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
		}, function (code) {
    		console.error("Error: " + code);
  		});
	});

