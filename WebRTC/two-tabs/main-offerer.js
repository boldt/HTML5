
	var peerConnection = new RTCPeerConnection(servers, undefined);
	trace('Peer connectionc created');

	$('#offer').click(function () {
		save_rb();
		$('#offer').prop('disabled', true);

		// Fired if the ICE gathering is complete
		// @see: http://stackoverflow.com/a/25489506/605890
		var candidates = [];
		peerConnection.onicecandidate = function (event) {
			if(event.candidate) {
				console.log(event.candidate);
				var c = parseCandidate(event.candidate.candidate);
				trace('ICE: ' + c.type + ' Candidate');
				if(c.type === 'host' && $('#offer_host').prop('checked')) {
					candidates.push(event.candidate);
				} else if(c.type === 'srflx' && $('#offer_srflx').prop('checked')) {
					candidates.push(event.candidate);
				} else if(c.type === 'relay' && $('#offer_relay').prop('checked')) {
					candidates.push(event.candidate);
				}
				$("#ice-offerer").text(JSON.stringify(candidates));
			} else {
				trace('Gather ICE Candidates done');
			}
		};

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
	});


	$('#connect').click(function () {
		$('#connect').prop('disabled', true);

		handleRemoteDescription(peerConnection, $("#sdp-answerer").val(), function(){
			handleIceCandidates($("#ice-answerer").val())
		});
	});

