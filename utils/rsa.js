import {
	JSEncrypt
} from './jsencrypt'
// 加密公钥
const PUBLIC_KEY =
	`MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvnuBHhh9/Mwi4Z8Ea2IfVc7SJYyKkJT+4m4LBJbgxRVPa+ej1iAvJAJ++1CNfH6oVr6tw/wqEIZybTG7+iPm7SzfoW9eb/LYsLR43zLqriYWy7qAd7S/13zILiAGLUy/h9CDYwoXYaNXanVGe0iJb+NXmg7f4MAEo7rR15QHQ8zDtomPI/Fz9vz+o/xzHqsLVnxZIpn4dlCp+7QtzOePnvEda5xqWk4DNaVV2fr9gwfBFd8MyAP+CyBXLAWpmxinRU6knsLKAlqcbOLNjk2+aPNvH9EWHODKWBuMPpdDwQexD+V3/nOp8c07NzSfwXmlZuRKod9SqVY88Pg1r84WwQIDAQAB`
// 加密
var rsaEncrypt = function(msg) {
	const jsencrypt = new JSEncrypt()
	jsencrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----')
	const encryptMsg = jsencrypt.encrypt(msg)
	return encryptMsg
}
// 解密私钥
const PRIVATE_KEY =
	`MIIEowIBAAKCAQEAvnuBHhh9/Mwi4Z8Ea2IfVc7SJYyKkJT+4m4LBJbgxRVPa+ej1iAvJAJ++1CNfH6oVr6tw/wqEIZybTG7+iPm7SzfoW9eb/LYsLR43zLqriYWy7qAd7S/13zILiAGLUy/h9CDYwoXYaNXanVGe0iJb+NXmg7f4MAEo7rR15QHQ8zDtomPI/Fz9vz+o/xzHqsLVnxZIpn4dlCp+7QtzOePnvEda5xqWk4DNaVV2fr9gwfBFd8MyAP+CyBXLAWpmxinRU6knsLKAlqcbOLNjk2+aPNvH9EWHODKWBuMPpdDwQexD+V3/nOp8c07NzSfwXmlZuRKod9SqVY88Pg1r84WwQIDAQABAoIBAD/Fb2vY/U0GNuNcbolY926t6FMj4zwWdeLuvoeRz7yLruRMT+CfM8kVgNe4lzXH3an0+o3zvU19BZAjJ3DOVkCvVktg0rgeEIfQU+s9y630GIuqa9onzFZjc01l8Ut3N2RL3cDpnvxUSC7fBnK9zS2Fak2sjy1ae/Mo15oZ9/itX1WYaVmDmnqopbbopfEL5UkqgwTe8KlZs7iTr5wqBqOfaTS/QU8pEXBy0m3HQwmH2KUfK9ZZOXJGPF+WZ+2OU95mFEscLNwXRZcrhO0SbcLh6dZiNZJBdu3dANsOPsPO5DUhZskLHJMeiFK3yOUcpgK6R51tTLxGYvJBHKd3nlUCgYEAxfLvsCinuORa3oUhWNaKRwa14uTAyhN1Gd6w/jGOcdM7x5vKqahD6iEMay+7B//3xNYjiPVZlyVojBxuvjDMuW9/jg3nWL7taf5WJTVQUNzE/h0vShPFQy6zskgeXYp/ceHNZzkoY3OqnW/qDrDvrLUZJLL7DM/PUXw7AJ5TH18CgYEA9lgEPuP8/h+tH6uxH8rdr4TmgsGrhProAvFw0CTSFsOlOWM2IP7U3/MYsMlWCVB8CZXgfX4z6FsWKlFT4gXwq96VaCfRyyvVQLsxZ10RyjhaZZKQS8p8n8DaRIjRh2Otqi8RJcdoNzGYGrxzZXO+H9vCOudDFRJ8skDyGQwoHd8CgYAMLzH1w+rfBJ9bRxKQZ1RHnvAfMTl0ttHkb8KxQtejxf7OAJbu7n6PsM0U4/E9QtI7eXrieUe0eAcBaNagOly/pU9SrSRqYAY5GgCvdaKl95Dgm2dHxgPEaOGCvdGwrE+/8Mg17FzCEmKUIklj8hwuo08S5Tlyxm/aci0nkpdHPQKBgQCEETXdfZ8BonvPEd34vGrTEX3/NdM9jMJb6ZLglAzp1WO7+3tmfxgjJBHlnVr5zWNiRC7BOKqddE/Syh0dfK/FhKQ23bo0oUBH3tOipZvG/SVBdSzU5S6g+uRJf8xNOFw/c9JOnbQ6euUf2E5JYp7YN5nOuHMXVfzyF61zTjgnowKBgHqozPZH2yTU0bgQfZBsUBFB4vpUkfzB6o6qOOFQ4uiLqvW64LghE1yf7S5+XYz8ZXtIf7yb7sZcJE6XR9BD4gdYl/0KnWRL+oJQMUGDZDBzOcHiHQ8gdyACAC5hFexngJE0RNHtYcg2QjUNMfZMu/eUXJ1EjzisCT0xbwIXv0oZ`
// 解密
var rsaDecrypt = function(msg) {
	const decrypt = new JSEncrypt()
	decrypt.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----'+PRIVATE_KEY+'-----END RSA PRIVATE KEY-----')
	const decryptMsg = decrypt.decrypt(msg)
	return decryptMsg
}
export default {
	rsaEncrypt: rsaEncrypt,
	rsaDecrypt: rsaDecrypt
}
