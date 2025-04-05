// Wait until the DOM content is fully loaded before running the scripts.
document.addEventListener('DOMContentLoaded', () => {
    // Add a click event listener to the modal-close button.
    // When clicked, the user is redirected to the homepage.
    document.getElementById('modal-close').addEventListener('click', () => {
        window.location.href = baseUrl;
    });

    // Add a click event listener to the unlock button.
    // This handler retrieves data from the input fields, decrypts the cipher text, and displays the note.
    document.getElementById('unlock').addEventListener('click', async () => {
        const cipherText = document.getElementById('message').value; // Retrieve the encrypted message.
        const iv = databaseToIv(document.getElementById('iv').value); // Convert the IV from its stored format.
        const password = document.getElementById('password').value; // Retrieve the password input.

        try {
            // Attempt to decrypt the cipher text using the provided password and IV.
            const note = await decrypt(cipherText, password, iv);

            // If successful, update the note element with the decrypted note.
            document.getElementById('note-placeholder').classList.add('hidden'); // Hide the encrypted message.
            document.getElementById('note-content').innerText = note;
            document.getElementById('note-content').classList.remove('hidden'); // Show the decrypted note.
            // Hide the modal background and modal since decryption was successful.
            document.getElementById('modal-background').classList.add('hidden');
            document.getElementById('modal').classList.add('hidden');
        } catch (err) {
            // Log any errors that occur during decryption.
            alert(err);
        }
    });
});
