
	var peerConnection = new RTCPeerConnection(servers, undefined);
	trace('Peer connection created');

	$('#answer').click(function () {

		// Fired if the ICE gathering is complete
		// @see: http://stackoverflow.com/a/25489506/605890
		// INVALID?
		// Firefox includes the Candidate in the Offer SDP.
		// https://hacks.mozilla.org/2013/07/webrtc-and-the-early-api/
		var candidates = [];
		peerConnection.onicecandidate = function (event) {
			if(event.candidate) {
				console.log(event.candidate);
				var c = parseCandidate(event.candidate.candidate);
				trace('ICE: ' + c.type + ' Candidate');
				if(c.type === 'host' && $('#answerer_host').prop('checked')) {
					candidates.push(event.candidate);
				} else if(c.type === 'srflx' && $('#answerer_srflx').prop('checked')) {
					candidates.push(event.candidate);
				} else if(c.type === 'relay' && $('#answerer_relay').prop('checked')) {
					candidates.push(event.candidate);
				}
				$("#ice-answerer").text(JSON.stringify(candidates));
			} else {
				trace('Gather ICE Candidates done');
			}
		};

		peerConnection.ondatachannel = function (event) {
			trace('Channel: created');
			channel = event.channel;
			handleChannel(channel);
		};

		save_rb();
		$('#answer').prop('disabled', true);
		handleRemoteDescription(peerConnection, $("#sdp-offerer").val(), function() {
			peerConnection.createAnswer(
				function (answer) {
					trace('Answer created');
					peerConnection.setLocalDescription(answer, function() {
					}, function(e) {
						console.log("ERROR: setLocalDescription", e)
					});
					$("#sdp-answerer").append(JSON.stringify(answer));
					handleIceCandidates($("#ice-offerer").val());
				}, function (code) {
					console.error("Error: " + code);
					}, constraints
			);
		});
	});
