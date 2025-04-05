// Wait until the DOM content is fully loaded before running the scripts
document.addEventListener('DOMContentLoaded', () => {
    // Add change event listener on all radio inputs with name "type"
    document.querySelectorAll('input[name=type]').forEach((input) =>
        input.addEventListener('change', () => {
            // Get the value of the selected radio button
            const type = document.querySelector('input[name=type]:checked').value;
            // Get the expiry element from the DOM
            const expiry = document.getElementById('expiry');

            // If "timebased" option is selected, show and require the expiry field
            if (type === 'timebased') {
                expiry.classList.remove('hidden');
                expiry.required = true;
            } else {
                // Otherwise, hide the expiry field and remove the required attribute
                expiry.classList.add('hidden');
                expiry.required = false;
            }
        }),
    );

    // Add change event listener on the "protected" checkbox
    document.getElementById('protected').addEventListener('change', (e) => {
        // Get password-related elements from the DOM
        const passwords = document.getElementById('passwords');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');

        // If the checkbox is checked, show password fields and mark them as required
        if (e.target.checked) {
            passwords.classList.remove('hidden');
            password.classList.remove('hidden');
            confirmPassword.classList.remove('hidden');

            password.required = true;
            confirmPassword.required = true;
        } else {
            // Otherwise, hide password fields and remove their required attribute
            passwords.classList.add('hidden');
            password.classList.add('hidden');
            confirmPassword.classList.add('hidden');

            password.required = false;
            confirmPassword.required = false;
        }
    });
});
