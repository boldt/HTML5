var aes_cbc = function (buf) {

	/*
     * Cipher-block chaining (CBC)
     * 
	 * http://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29
     * 
     * To make each message unique, an initialization vector must be used in the first block.
     * 
	 */

	var algorithmName = 'AES-CBC';
	var extractable = true;
	var keyUsages = ['encrypt', 'decrypt'];
	var keyLengthBits = 128;

	var aesKeyGenParams = { name: algorithmName, length: keyLengthBits };
	var results = {};

	var ivBuf = crypto.getRandomValues(new Uint8Array(16))
	var aesCbc = { name: "AES-CBC", iv: ivBuf };

	console.log("Raw data", buf)

	// Generate random key
	crypto.subtle.generateKey(aesKeyGenParams, extractable, keyUsages).then(function(key_gen) {
		console.log("Generated key", key_gen);

		// AES enc
		crypto.subtle.encrypt(aesCbc, key_gen, buf).then(function(data_enc) {
			console.log("Encrypted data: ", new Uint8Array(data_enc));

			// Key --> AB
			crypto.subtle.exportKey('raw', key_gen).then(function(key_ab) {
				console.log("Exported key", new Uint8Array(key_ab));

				// AB --> Key
				crypto.subtle.importKey("raw", key_ab, { name: "AES-CBC" }, true, keyUsages).then(function(key_imp) {
					console.log("Imported key", key_imp);

					// AES dec
					crypto.subtle.decrypt(aesCbc, key_imp, data_enc).then(function(data_dec) {
						console.log("DONE");
						console.log("Decrypted data: ", new Uint8Array(data_dec));		
					});
				});
			});
		});

	});
};
