
	var peerConnection = new RTCPeerConnection(servers, undefined);

	// Fired if the ICE gathering is complete
	// @see: http://stackoverflow.com/a/25489506/605890
	// Firefox includes the Candidate in the Offer SDP.
	// https://hacks.mozilla.org/2013/07/webrtc-and-the-early-api/
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
		peerConnection.createAnswer(
			function (answer) {
				trace('Session (answer): Created');
				peerConnection.setLocalDescription(answer, function() {
				}, function(e) {
					console.log("ERROR: setLocalDescription", e)
				});
				$("#sdp-answerer").val(JSON.stringify(answer))
			}, function (code) {
				console.error("Error: " + code);
	  		}, constraints
		);
	});

