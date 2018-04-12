	$('#offer').click(function () {
		save_rb();
		$('#offer').prop('disabled', true);

		channel = pc.createDataChannel("sendDataChannel", {reliable: true});
		trace('Channel: created');
		handleChannel(channel);

    offer();
	});


	$('#connect').click(function () {
		$('#connect').prop('disabled', true);

		handleRemoteDescription(pc, $("#sdp-remote").val(), function(){
			handleIceCandidates($("#ice-remote").val())
		});
	});

