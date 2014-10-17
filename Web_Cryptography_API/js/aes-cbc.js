var aes_cbc = function (buf) {

	/*
     * Cipher-block chaining (CBC)
     * 
	 * http://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29
     * 
     * To make each message unique, an initialization vector must be used in the first block.
     * 
	 */

    var aes = {};
	aes.algorithmName = 'AES-CBC';
	aes.extractable = true;
	aes.keyUsages = ['encrypt', 'decrypt'];
	aes.keyLengthBits = 128;
	aes.aesKeyGenParams = { name: aes.algorithmName, length: aes.keyLengthBits };
	aes.ivBuf = crypto.getRandomValues(new Uint8Array(16))
	aes.aesCbcParams  = { name: "AES-CBC", iv: aes.ivBuf };

	console.log("Raw data", buf)

	// Generate random key
	crypto.subtle.generateKey(aes.aesKeyGenParams, aes.extractable, aes.keyUsages).then(function(key_gen) {
		console.log("Generated key", key_gen);

		// AES enc
		crypto.subtle.encrypt(aes.aesCbcParams , key_gen, buf).then(function(data_enc) {
			console.log("Encrypted data: ", new Uint8Array(data_enc));

			// Key --> AB
			crypto.subtle.exportKey('raw', key_gen).then(function(key_ab) {
				console.log("Exported key", new Uint8Array(key_ab));

				// AB --> Key
				crypto.subtle.importKey("raw", key_ab, { name: aes.algorithmName }, true, aes.keyUsages).then(function(key_imp) {
					console.log("Imported key", key_imp);

					// AES dec
					crypto.subtle.decrypt(aes.aesCbcParams , key_imp, data_enc).then(function(data_dec) {
						console.log("Decrypted data: ", new Uint8Array(data_dec));		
					});
				});
			});
		});

	});
};
