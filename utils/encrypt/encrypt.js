import CryptoJS from '@/utils/encrypt/cryptojs.js';

const KEY = `12345678876543211234567887654abc`
// 加密
var aesEncrypt = function(msg) {
	var encrypt = CryptoJS.AES.encrypt(msg, CryptoJS.enc.Utf8.parse(KEY), {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString();
	return encrypt;
}
// 解密
var aesDecrypt = function(msg) {
	var decrypt = CryptoJS.AES.decrypt(msg, CryptoJS.enc.Utf8.parse(KEY), {
		mode: CryptoJS.mode.ECB,
		padding: CryptoJS.pad.Pkcs7
	}).toString(CryptoJS.enc.Utf8);
	return decrypt;
}
export default {
	aesEncrypt,
	aesDecrypt
}
