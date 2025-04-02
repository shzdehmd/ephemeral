// Wait until the DOM content is fully loaded before running the scripts
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for the form submission
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        // Gather form input values
        const message = document.getElementById('message').value;
        const type = document.querySelector('input[name=type]:checked').value;
        const expiry = document.getElementById('expiry').value;
        const protected = document.getElementById('protected').checked;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate that the message is not empty
        if (!message || message === '') return alert('The note cannot be empty.');

        // Validate the note type
        if (!['onetime', 'timebased', 'permanent'].includes(type))
            return alert(
                'The type of your note is incorrect.\n\nIt can only be one of the following:\n- onetime\n- timebased',
            );

        // If note is time-based, ensure an expiry date and time is provided
        if (type === 'timebased' && expiry === '')
            return alert('Please provide an expiry date and time for time-based notes.');

        // If the note is password protected, ensure both password and confirmation are provided and match
        if (protected && (!(password && confirmPassword) || password !== confirmPassword))
            return alert('The password and password confirmation are incorrect.');

        let encryptedMessage = '';
        let iv = ''; // Initialization vector for encryption
        let encrypted = false;
        // Encrypt the message if password protection is enabled
        if (protected && password === confirmPassword) {
            encrypted = true;
            iv = genIV(); // Generate a new initialization vector
            encryptedMessage = await encrypt(message, password, iv);
        }

        // Prepare the note object to be sent to the server
        const note = {
            message: encrypted ? encryptedMessage : message,
            type,
            expiry,
            iv: ivToDatabase(iv), // Convert the IV to a format suitable for the database
            encrypted,
        };

        // Send the note to the server using a POST request
        const res = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });
        const data = await res.json();

        // If the note was successfully created, display the note link in a modal
        if (data.success) {
            const link = `${window.location.href}view/${data.slug}`;
            document.getElementById('output-link').innerText = link;
            document.getElementById('output-link').setAttribute('href', link);
            document.getElementById('modal-background').classList.remove('hidden');
            document.getElementById('modal').classList.remove('hidden');
        } else {
            // Display an error message if the note creation failed
            alert(data.error);
        }
    });

    // Add event listener to close the modal when the close button is clicked
    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('output-link').innerText = '';
        document.getElementById('output-link').setAttribute('href', '#');
        document.getElementById('modal-background').classList.add('hidden');
        document.getElementById('modal').classList.add('hidden');
    });

    // Add event listener to copy the note link to the clipboard when the copy button is clicked
    document.getElementById('copy-link').addEventListener('click', () => {
        const link = document.getElementById('output-link').getAttribute('href');
        navigator.clipboard
            .writeText(link)
            .then(() => {
                alert('Link copied to clipboard');
            })
            .catch(() => {
                alert('Failed to copy link');
            });
    });
});
