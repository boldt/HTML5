
	$('#answer').click(function () {

		pc.ondatachannel = function (event) {
			trace('Channel: created');
			channel = event.channel;
			handleChannel(channel);
		};

		save_rb();
		$('#answer').prop('disabled', true);
		handleRemoteDescription(pc, $("#sdp-remote").val(), function() {
      answer();
		});
	});
