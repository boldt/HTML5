# Web Cryptography API

* Firefox Status: https://docs.google.com/spreadsheet/ccc?key=0AiAcidBZRLxndE9LWEs2R1oxZ0xidUVoU3FQbFFobkE&usp=sharing#gid=1
* Chrome Status: https://docs.google.com/document/d/184AgXzLAoUjQjrtNdbimceyXVYzrn3tGpf3xQGCN10g/edit

# MWE

Minimal working examples related to 

* http://www.w3.org/TR/WebCryptoAPI/
* Examples: http://www.w3.org/TR/WebCryptoAPI/#examples-section
* http://www.w3.org/TR/webcrypto-usecases/
* http://msdn.microsoft.com/de-de/library/ie/dn265046%28v=vs.85%29.aspx
* http://nick.bleeken.eu/demos/web-crypto-samples/index.html
  * https://github.com/nvdbleek/web-crypto-samples
* https://github.com/Netflix/NfWebCrypto
* http://www.admin-magazine.com/Articles/Web-Cryptography-API
* http://msdn.microsoft.com/en-us/library/ie/dn302329%28v=vs.85%29.aspx
* Demos: https://jswebcrypto.azurewebsites.net/demo.html

## Chromium/Chrome

* [Issue 245025: Implement WebCrypto](https://code.google.com/p/chromium/issues/detail?id=245025)
* Status:
  * https://docs.google.com/document/d/184AgXzLAoUjQjrtNdbimceyXVYzrn3tGpf3xQGCN10g/edit
  * [Compliant with `Draft 18 March 2014`] (https://dvcs.w3.org/hg/webcrypto-api/raw-file/0a08958cf50f/spec/Overview.html)

## Firefox

* [Last Comment Bug 865789 - (web-crypto) Implement W3C Web Crypto API](https://bugzilla.mozilla.org/show_bug.cgi?id=865789)
  * See depends on
* [2014-03-20 - As of this version, the following features should basically work](https://bugzilla.mozilla.org/show_bug.cgi?id=865789#c15):
  * Encrypt  : AES-CBC, AES-CTR, AES-GCM, RSAES-PKCS1-v1_5
  * Decrypt  : AES-CBC, AES-CTR, AES-GCM, RSAES-PKCS1-v1_5
  * Sign     : HMAC-SHA*, RSASSA-PKCS1-v1_5
  * Verify   : HMAC-SHA*, RSASSA-PKCS1-v1_5
  * Digest   : SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
    * [Last Comment Bug 998804 - Add support for SHA-1 and SHA-2 digests to WebCrypto API](https://bugzilla.mozilla.org/show_bug.cgi?id=998804)
    * [Available from FF32](https://docs.google.com/spreadsheet/ccc?key=0AiAcidBZRLxndE9LWEs2R1oxZ0xidUVoU3FQbFFobkE&usp=sharing#gid=1)
  * Import   : raw (AES/HMAC), spki (for RSA)
  * Export   : raw (AES/HMAC), spki (for RSA)
  * Generate : symmetric (AES/HMAC), RSA
* Diffie Hellman (DH)
  * https://bugzilla.mozilla.org/show_bug.cgi?id=1034856
