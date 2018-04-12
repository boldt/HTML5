
	$('#answer').click(function () {
		save_ice_types();
		//$('#answer').prop('disabled', true);
		handleRemoteDescription(pc, $("#sdp-remote").val(), function() {
      answer();
		});
	});
