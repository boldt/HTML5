
	var peerConnection = new RTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]});

	// Fired if the ICE gathering is complete
	// @see: http://stackoverflow.com/a/25489506/605890
	peerConnection.onicecandidate = function (event) {
		trace('ICE: Created');
		if(event.candidate) {
			$("#ice-answerer").val(JSON.stringify(event.candidate))
		}
		peerConnection.onicecandidate = null;
	};
	trace('Peer connection: Created');

	peerConnection.ondatachannel = function (event) {
		trace('Channel: created');
		channel = event.channel;
		handleChannel(channel);
	};

	$('#get').click(function () {
		handleConnection(peerConnection, $("#sdp-offerer").val(), $("#ice-offerer").val());
		peerConnection.createAnswer(function (answer) {
			trace('Session (answer): Created');
			peerConnection.setLocalDescription(answer);
			$("#sdp-answerer").val(JSON.stringify(answer))
		}, function (code) {
    		console.error("Error: " + code);
  		});
	});

