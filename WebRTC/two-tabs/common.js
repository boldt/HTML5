var stun_turn_host = 'coturn.dennis-boldt.de';
var ws_url = 'wss://localhost:12345';

var	servers = { "iceServers":
	[
		{
			urls: 'stun:' + stun_turn_host + ':3478'
		}
/*
		,{
			urls: 'turn:' + stun_turn_host + ':3478',
			credential: '',
			username: ''
		}
*/
	]
};

var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;
var IceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
// ##########################################################

var pc = new PeerConnection(servers, undefined);
trace('Peer connection created');

// Fired if the ICE gathering is complete
// @see: http://stackoverflow.com/a/25489506/605890
// INVALID?
// Firefox includes the Candidate in the Offer SDP.
// https://hacks.mozilla.org/2013/07/webrtc-and-the-early-api/
var candidates = [];
pc.onicecandidate = function (event) {
  if(event.candidate) {
    var c = parseCandidate(event.candidate.candidate);
    trace('ICE: ' + c.type + ' Candidate');
    if(c.type === 'host' && $('#host').prop('checked')) {
      candidates.push(event.candidate);
    } else if(c.type === 'srflx' && $('#srflx').prop('checked')) {
      candidates.push(event.candidate);
    } else if(c.type === 'relay' && $('#relay').prop('checked')) {
      candidates.push(event.candidate);
    }
    //console.log(candidates);
    $("#ice-local").text(JSON.stringify(candidates));
  } else {
    trace('Gather ICE Candidates done');
  }
};

// pc.ontrack
pc.onaddstream = function(obj) {
  var player = undefined;
  if (obj.stream.getAudioTracks().length > 0) {
    trace('Add audio stream');
    player = document.querySelector("#audioPlayer-remote");
  } else if (obj.stream.getVideoTracks().length > 0) {
    trace('Add video stream');
    player = document.querySelector("#videoPlayer-remote");
  } else {
    console.warn('Unknown stream type!');
  }
  if(player) {
    player.src = window.URL.createObjectURL(obj.stream);
    obj.stream.getTracks().forEach(function(track) {
      track.onended = function() {
        console.log('Track ended!');
      }
      console.log('TRACK', track);
    });
  }
}

pc.ondatachannel = function (event) {
  channel = event.channel;
  trace('New remote data channel: ' + channel.label);
  handleChannel(channel);
};

pc.onnegotiationneeded = function() {
  console.log('onnegotiationneeded');
}

var offer = function() {

  $("#sdp-local").html("");
  //candidates = [];

	pc.createOffer({
    offerToReceiveVideo: true,
    offerToReceiveAudio: true,
    iceRestart: true
  }).then(
			function (offer) {
				trace('Offer created');
				pc.setLocalDescription(offer, function() {
				}, function(e) {
					console.log("ERROR: setLocalDescription", e)
				});
				$("#sdp-local").append(JSON.stringify(offer));
			}, function (code) {
				console.error("Error: " + code);
	  		});
};

var answer = function() {

  $("#sdp-local").html("");

  pc.createAnswer(
    function (answer) {
      trace('Answer created');
      pc.setLocalDescription(answer, function() {
      }, function(e) {
        console.log("ERROR: setLocalDescription", e)
      });
      $("#sdp-local").append(JSON.stringify(answer));
      handleIceCandidates($("#ice-local").val());
    }, function (code) {
      console.error("Error: " + code);
    });
};

// ##########################################################

function trace(text) {
	var msg = (performance.now() / 1000).toFixed(3) + ": " + text;
	$('#log').html(msg + "\n" + $('#log').html());
};

var audio = undefined;
var audioEnabled = false;
var audioPlayer = document.querySelector("#audioPlayer-local");

$('#audio').click(function () {
  if(audio) {
    trace('Disable audio!');
    $('#audio').html('Add audio');

    pc.removeStream(audio);
    audio.getTracks().forEach(track => track.stop());
    audio = undefined;

  } else {
    trace('Init audio!');
    $('#audio').html('Remove audio');
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(function(stream) {
      audio = stream;

      // https://bugs.chromium.org/p/chromium/issues/detail?id=705901&desc=2
      //if(pc.addTrack) {
      //  audio.getTracks().forEach(function(track) {
      //    pc.addTrack(track, audio);
      //  });
      //} else {
      pc.addStream(audio);
      //}

      audioPlayer.src = window.URL.createObjectURL(audio);
      audioEnabled = true;
    });
  }
});

var video = undefined;
var videoEnabled = false;
var videoPlayer = document.querySelector("#videoPlayer-local");

$('#video').click(function () {
  if(video) {
    trace('Disable video!');
    $('#video').html('Add video');

    pc.removeStream(video);
    video.getTracks().forEach(track => track.stop());
    video = undefined;
  } else {
    trace('Init video!');
    $('#video').html('Remove video');

    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(function(stream) {
      video = stream;

      if(pc.addTrack) {
        video.getTracks().forEach(function(track) {
          pc.addTrack(track, video);
        });
      } else {
        pc.addStream(video);
      }

      videoPlayer.src = window.URL.createObjectURL(video);
      videoEnabled = true;
    });
  }
});

function handleChannel(channel) {

	channel.onopen = function () {
		trace('Data channel opened: ' + channel.label + ' ');

		//var data = "Hello World!"
		//trace('Channel: send message: ' + data);
		//channel.send(data);
	};

	channel.onclose = function () {
		trace('Channel: Closed:', channel.label);
	};

	channel.onmessage = function (event) {
		trace('Channel: received message: ' + event.data);
	};
};

var channel;

$('#channel').click(function () {
  if(channel) {
    $('#channel').html('Add Data Channel');
    trace('Stop channel!');
    channel.close()
    channel = undefined;
  } else {
    $('#channel').html('Remove Channel');
    var id = Math.floor(Math.random() * 10000) + 1;
    //var id = "hallo";
    trace('New local data channel: ' + id);
    channel = pc.createDataChannel(id, {
      reliable: true
    });
    trace('Channel: created');
    handleChannel(channel);
  }
});






/*
 * Sets the SDP and the ICE
 */
function handleRemoteDescription(pc, sdp, cb) {
	// Set SDP
	sdp = new SessionDescription(JSON.parse(sdp));
	pc.setRemoteDescription(sdp, cb, function(e) {
		console.error("ERROR: setRemoteDescription", e)
	});
};

function handleIceCandidates(iceCandidates) {
	// Set ICE
	if(iceCandidates) {
		iceCandidates = JSON.parse(iceCandidates);
		for(var i = 0; i < iceCandidates.length; i++) {
			var ice = new IceCandidate(iceCandidates[i]);
			pc.addIceCandidate(ice);
		}
	}
}

$('#close').click(function () {
	channel.close();
	trace('Channel: Closed');
	pc.close();
	trace('Peer connection: Closed');
});

// Borrowed from
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/trickle-ice/js/main.js
function parseCandidate(text) {
  var candidateStr = 'candidate:';
  var pos = text.indexOf(candidateStr) + candidateStr.length;
  var fields = text.substr(pos).split(' ');
  return {
    'component': fields[1],
    'type': fields[7],
    'foundation': fields[0],
    'protocol': fields[2],
    'address': fields[4],
    'port': fields[5],
    'priority': formatPriority(fields[3])
  };
}

// Borrowed from
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/trickle-ice/js/main.js
// Parse the uint32 PRIORITY field into its constituent parts from RFC 5245,
// type preference, local preference, and (256 - component ID).
// ex: 126 | 32252 | 255 (126 is host preference, 255 is component ID 1)
function formatPriority(priority) {
  var s = '';
  s += (priority >> 24);
  s += ' | ';
  s += (priority >> 8) & 0xFFFF;
  s += ' | ';
  s += priority & 0xFF;
  return s;
}


// Based on https://stackoverflow.com/a/23212379
var i, checkboxes = document.querySelectorAll('input[type=checkbox]');
function save_ice_types() {
	for (i = 0; i < checkboxes.length; i++) {
		localStorage.setItem(checkboxes[i].id, checkboxes[i].checked);
	}
}

// Load checkboxes
for (i = 0; i < checkboxes.length; i++) {
  checkboxes[i].checked = localStorage.getItem(checkboxes[i].id) === 'false' ? false : true;
}

//##################################################################
// WebSocket Signaling channel
//##################################################################

$('#signal').hide();

var connection = new WebSocket(ws_url);

// When the connection is open, send some data to the server
connection.onopen = function () {
  console.log('WS connection opened!');
  $('#signal').show();
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ', error);
};

// Log messages from the server
connection.onmessage = function (e) {
  //console.log('Msg from server: ', e.data);
  var o = JSON.parse(e.data);
  $("#sdp-remote").val(o.sdp);
  $("#ice-remote").val(o.ice);
};


$('#signal').click(function () {
  var o = {
    sdp: $("#sdp-local").val(),
    ice: $("#ice-local").val()
  }
  connection.send(JSON.stringify(o));
});
