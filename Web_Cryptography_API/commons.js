var sha1ArrayBufferToString = function(buffer) {

	// From sha1.js
	var cvt_hex = function (val) {
		var str = "";
		var i;
		var v;

		for (i = 1; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};

	var uint8 = new Uint8Array(buffer);
	var temp = "";
	for(var i=0;i<uint8.length; i++) {
		temp += cvt_hex(uint8[i]);
	}
	return temp.toLowerCase();
};
