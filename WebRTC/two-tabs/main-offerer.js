
	var peerConnection = new RTCPeerConnection(servers, undefined);

	// Fired if the ICE gathering is complete
	// @see: http://stackoverflow.com/a/25489506/605890
	var candidates = [];
	peerConnection.onicecandidate = function (event) {
		if(event.candidate) {
			console.log(event.candidate);
			var c = parseCandidate(event.candidate.candidate);
			candidates.push(event.candidate);
			trace('ICE: ' + c.type + ' Candidate');
			$("#ice-offerer").text(JSON.stringify(candidates)  + "\n");
		} else {
			trace('Gather ICE Candidates done');
		}
	};
	trace('Peer connectionc created');

	channel = peerConnection.createDataChannel("sendDataChannel", {reliable: true});
	trace('Channel: created');
	handleChannel(channel);

	peerConnection.createOffer(
		function (offer) {
			trace('Offer created');
			peerConnection.setLocalDescription(offer, function() {
			}, function(e) {
				console.log("ERROR: setLocalDescription", e)
			});
			$("#sdp-offerer").append(JSON.stringify(offer));
		}, function (code) {
    		console.error("Error: " + code);
  		}, constraints
	);

	$('#get').click(function () {
		handleRemoteDescription(peerConnection, $("#sdp-answerer").val(), function(){
			handleIceCandidates($("#ice-answerer").val())
		});
	});
