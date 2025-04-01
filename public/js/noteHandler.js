// Function to convert a Base64 IV string back to an ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// Wait until the DOM content is fully loaded before running the scripts
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modal-close').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('unlock').addEventListener('click', async () => {
        const cipherText = document.getElementById('message').value;
        const iv = databaseToIv(document.getElementById('iv').value);
        const password = document.getElementById('password').value;

        try {
            const note = await decrypt(cipherText, password, iv);

            document.getElementById('note').innerText = note;
            document.getElementById('modal-background').classList.add('hidden');
            document.getElementById('modal').classList.add('hidden');
        } catch (err) {
            console.log(err);
        }
    });
});
