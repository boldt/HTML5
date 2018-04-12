	$('#offer').click(function () {
		save_ice_types();
		//$('#offer').prop('disabled', true);
    offer();
	});


	$('#connect').click(function () {
//		$('#connect').prop('disabled', true);

		handleRemoteDescription(pc, $("#sdp-remote").val(), function(){
			handleIceCandidates($("#ice-remote").val())
		});
	});

