// const NodeRSA = require("node-rsa");
// import JSEncrypt from 'jsencrypt';
// import NodeRSA from "node-rsa";
// import * as Buffer from 'buffer';


let RSAkey1 = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArNRJK5Nly/RgwMXgXbCN
juGKlpjuHg2RRqmnBIgMcaNT7yL13bar0NZJpxLx27Ppse6IvbnogsKdoJFgA4l6
igJkZDsemQ0rVBDIqXW0de+EFYDxv9nu8C7gIgx+o6MS9+jArD6/VMrZivjrYytQ
UhR1f8FOaGKPbssp/U20UPD14SBm9cV1jrSNZVB4lVHafREz7/SIOg4Gco9OCjXL
WPkCa/hat2XKVpUhtku5wfHd5tg/+4xO3ZtHmuQLXted5TAIFT3xiJ8PZUmGgXAM
77umwuV3ZYLDkYRBroYjl9UiPtR2MNFFgptqPv8mdBwUh0pUPhBLMIY/URNsqLHv
Fg+jN13rAp82uv0qM3L3ScqwLmYJaKGUIb0+wBJdYAfihPz1BpkZ3hmhvjAiqOVe
MIdf84HWRwdnea4ijYummlfIIgAJDLtGKpJRJtcad7XqCEkvipUUfvZE2RMwV5x7
XuOvGFHGURUL4SwCJbpH+YVZ4XkjK22xdpu6pNi36EfDmMPmR0WgQqdVfO2bCp+F
qpc0WcvuZ3dQGAnSzsPWbEhiizgUFuwmxqWVcDRXx2dAKVM5uzL6uQ/x86c5y3Fj
hgz+sxVZmi+pPmBIc0TWWk84R4C4oOB2CECjjhXHKa5K9mj6wlYdwNguxYug8Mp8
U3grMC58E1lqUrdymko0oKUCAwEAAQ==
-----END PUBLIC KEY-----`;


let RSAkey = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEAroittzcquieUqEmqlScJxnRL4cKs3sLdYHzNJtPB48AgqNcSQe34
p3l2LV9Wu2XTWHOd4f14Ep5d205/UYO8yXIZZdm8UEFd94ryh/Fhml7SbzFUqcCO
YS+6F5BDEDd5N3EppbOCrLbREg5kHfrHRF7oSkH/idXf8R/QcgGB3LyTGPcuwszC
+IIZuf2SrorFWeTkROu09VkxzkmgiURGhSN6hIhjgHsap9YNSxYeKLxsWHq+Lyyz
Aw+SoudEEmekC4vHjStk91/TxAdvOnn7ii9f6beVDjyWl0bINJiEbgaAQZDr00u6
rLDIR8rn/DrX/YAIC/SZhv8qJSOdfJdI6QIDAQAB
-----END RSA PUBLIC KEY-----
`
// export const encryption = async (data) => {
//     try {
//         const key = new NodeRSA(RSAkey); console.log(key, "KEYYYYY::::==>");
//         key.setOptions({ encryptionScheme: "pkcs1" });
//         const encStr = key.encrypt(data, "base64"); console.log(encStr, "encStr:::====>");
//         console.log("EX", encStr)
//         return encStr;
//     } catch (error) {
//         console.log("ERROR XX: ", error);
//         return false
//     }

// };


import * as Buffer from 'buffer';
import JSEncrypt from 'jsencrypt'; // Assuming you're using JSEncrypt for encryption

export const encryption = async (data) => {
    try {
        console.log("data::", data, "type ofData::", typeof data);
        const encrypt = new JSEncrypt({ default_key_size: 2048 });

        // Split the large string into two parts
        const length = data.length;
        console.log("data.length", data.length)
        encrypt.setPublicKey(RSAkey1);

        const encStr = encrypt.encrypt(data);
        console.log("encStr:", encStr);

        return encStr;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const REACT_APP_DOMAIN_KEY = "mKgLeV8MYF3g8C095lujW4QCEdFfUdHd"


// export const encryption = (data) => {

//     try {

//         const second = new NodeRSA(RSAkey);
//         second.setOptions({ encryptionScheme: "pkcs1" });
//         const enc = second.encrypt(data, "base64");
//         console.log("end::", enc)
//         const dataa = {
//             dataString: enc,
//         };
//         console.log("enc::::", dataa);
//         return JSON.stringify(dataa);
//     } catch (error) {
//         console.error("Encryption error:", error);

//     }

// };