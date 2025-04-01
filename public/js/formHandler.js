// Wait until the DOM content is fully loaded before running the scripts
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const message = document.getElementById('message').value;
        const type = document.querySelector('input[name=type]:checked').value;
        const expiry = document.getElementById('expiry').value;
        const protected = document.getElementById('protected').checked;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!message || message === '') return alert('The note cannot be empty.');

        if (!['onetime', 'timebased'].includes(type))
            return alert(
                'The type of your note is incorrect.\n\nIt can only be one of the following:\n- onetime\n- timebased',
            );

        if (type === 'timebased' && expiry === '')
            return alert('Please provide an expiry date and time for time-based notes.');

        if (protected && (!(password && confirmPassword) || password !== confirmPassword))
            return alert('The password and password confirmation are incorrect.');

        let encryptedMessage = '';
        let iv = '';
        let encrypted = false;
        if (protected && password === confirmPassword) {
            encrypted = true;
            iv = genIV();
            encryptedMessage = await encrypt(message, password, iv);
        }

        const note = {
            message: encrypted ? encryptedMessage : message,
            type,
            expiry,
            iv,
            encrypted,
        };

        const res = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        });

        console.log(res);
    });
});
