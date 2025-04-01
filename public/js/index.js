document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[name=type]').forEach((input) =>
        input.addEventListener('change', () => {
            const type = document.querySelector('input[name=type]:checked').value;
            const expiry = document.getElementById('expiry');

            if (type === 'timebased') {
                expiry.classList.remove('hidden');
                expiry.required = true;
            } else {
                expiry.classList.add('hidden');
                expiry.required = false;
            }
        }),
    );

    document.getElementById('protected').addEventListener('change', (e) => {
        const passwords = document.getElementById('passwords');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');

        if (e.target.checked) {
            passwords.classList.remove('hidden');
            password.classList.remove('hidden');
            confirmPassword.classList.remove('hidden');

            password.required = true;
            confirmPassword.required = true;
        } else {
            passwords.classList.add('hidden');
            password.classList.add('hidden');
            confirmPassword.classList.add('hidden');

            password.required = false;
            confirmPassword.required = false;
        }
    });
});
