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

    // const connectionSelect = document.getElementById('connection');

    // document.querySelectorAll('form').forEach((form) => {
    //     const fromInput = form.querySelector('input[name="fromDate"]');
    //     const toInput = form.querySelector('input[name="toDate"]');
    //     const connectionInput = form.querySelector('input[name="connectionID"]');
    //     const reportID = form.querySelector('input[name="reportID"]').value;
    //     const links = form.querySelectorAll('a');
    //     const reportSlug = form.getAttribute('action'); // Extracts /dashboard/reports/{reportSlug}

    //     function updateLinks() {
    //         const fromDate = encodeURIComponent(fromInput.value);
    //         const toDate = encodeURIComponent(toInput.value);
    //         const connectionID = encodeURIComponent(connectionInput.value);

    //         links.forEach((link) => {
    //             const url = new URL(window.location.origin + reportSlug); // Preserve reportSlug path
    //             url.searchParams.set('fromDate', fromDate);
    //             url.searchParams.set('toDate', toDate);
    //             url.searchParams.set('connectionID', connectionID);
    //             url.searchParams.set('reportID', reportID);

    //             // Assign the correct format
    //             if (link.classList.contains('pdf')) {
    //                 url.searchParams.set('format', 'pdf');
    //             } else if (link.classList.contains('excel')) {
    //                 url.searchParams.set('format', 'excel');
    //             } else {
    //                 url.searchParams.set('format', 'preview');
    //             }

    //             link.href = url.toString(); // Set updated href
    //         });
    //     }

    //     function updateConnectionID() {
    //         const newConnectionID = connectionSelect.value;
    //         connectionInput.value = newConnectionID; // Update the hidden field in form
    //         updateLinks(); // Refresh links
    //     }

    //     fromInput.addEventListener('change', updateLinks);
    //     toInput.addEventListener('change', updateLinks);
    //     connectionSelect.addEventListener('change', updateConnectionID);

    //     updateLinks(); // Initialize links on page load
    // });
});
