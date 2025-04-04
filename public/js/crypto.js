// Use AES-CBC for web crypto
const algo = 'AES-CBC';

// Generate a random IV (initialization vector)
const genIV = () => {
    // 16 bytes IV for AES-CBC (Uint8Array)
    return crypto.getRandomValues(new Uint8Array(16));
};

// Given a password string, create a CryptoKey using a SHA-256 digest
const getKey = async (password) => {
    const encoder = new TextEncoder();
    // Note: Using digest over the password is similar to your node hash
    const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    // Import the key material into a CryptoKey for AES-CBC
    return crypto.subtle.importKey('raw', keyMaterial, { name: algo }, false, ['encrypt', 'decrypt']);
};

// Helpers to convert between ArrayBuffer/Uint8Array and hexadecimal string
const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};

const hexToBuffer = (hex) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
};

// Encrypt a text string using a password and an IV; returns a hexadecimal string
const encrypt = async (plaintext, password, iv) => {
    const key = await getKey(password);
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const encryptedBuffer = await crypto.subtle.encrypt({ name: algo, iv }, key, data);
    return bufferToHex(encryptedBuffer);
};

// Decrypt a hexadecimal string using a password and an IV; returns the plain text
const decrypt = async (encryptedHex, password, iv) => {
    const key = await getKey(password);
    const encryptedBuffer = hexToBuffer(encryptedHex);
    const decryptedBuffer = await crypto.subtle.decrypt({ name: algo, iv }, key, encryptedBuffer);
    return new TextDecoder().decode(decryptedBuffer);
};

// Convert an IV (Uint8Array) to a hex string suitable for storing in a database
const ivToDatabase = (iv) => {
    return bufferToHex(iv);
};

// Convert a hex string from the database back into a Uint8Array suitable for the decrypt function
const databaseToIv = (hexString) => {
    return hexToBuffer(hexString);
};

// The code above was generated using GitHub Copilot from the below code which I had previously written
// for a different application to be used on the backend in NodeJS. THE BELOW CODE WAS NOT AI GENERATED.

// const crypto = require('node:crypto');

// const { CRYPTO_KEY } = require('./config');

// const algo = 'aes-256-cbc';

// const genIV = () => {
//     const iv = crypto.randomBytes(16);
//     return iv;
// };

// const encrypt = (decrypted, iv) => {
//     const key = crypto.createHash('sha256').update(String(CRYPTO_KEY)).digest('base64').substr(0, 32);

//     const cipher = crypto.createCipheriv(algo, key, iv);
//     const encrypted = cipher.update(decrypted, 'utf8', 'hex') + cipher.final('hex');

//     return encrypted;
// };

// const decrypt = (encrypted, iv) => {
//     const key = crypto.createHash('sha256').update(String(CRYPTO_KEY)).digest('base64').substr(0, 32);

//     const decipher = crypto.createDecipheriv(algo, key, iv);
//     const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

//     return decrypted;
// };

// module.exports = {
//     genIV,
//     encrypt,
//     decrypt,
// };
