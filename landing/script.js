document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body; // Get the body element

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active'); // Toggle active class on burger icon itself
            // Optional: Prevent body scroll when mobile menu is open
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                    body.style.overflow = ''; // Restore scroll
                }
            });
        });

        // Close menu if clicking outside of it (optional)
        document.addEventListener('click', (event) => {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                body.style.overflow = ''; // Restore scroll
            }
        });
    }

    // --- Simple Scroll Animation ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        // observer.unobserve(entry.target); // Keep observing if you want re-animation on scroll up/down
                    } else {
                        // Optional: Remove class if you want elements to fade out when scrolling away
                        // entry.target.classList.remove('is-visible');
                    }
                });
            },
            {
                threshold: 0.1, // Adjust threshold as needed (0.1 means 10% visible)
            },
        );

        animatedElements.forEach((el) => {
            observer.observe(el);
        });
    }

    // --- Optional: Parallax effect for background shapes (more complex) ---
    // This is a basic example; libraries like rellax.js can simplify this
    const backgroundShapes = document.querySelector('.background-shapes');
    if (backgroundShapes) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Adjust the '0.1' factor for more/less parallax effect
            backgroundShapes.style.transform = `translateY(${scrollY * 0.5}px)`;
        });
    }
});
