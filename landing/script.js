// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenuOverlay = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = mobileMenuOverlay ? mobileMenuOverlay.querySelectorAll('a') : []; // Get links inside mobile menu
    const body = document.body;

    // Function to open the menu
    function openMenu() {
        if (mobileMenuOverlay && navToggle) {
            mobileMenuOverlay.classList.add('active');
            mobileMenuOverlay.setAttribute('aria-hidden', 'false');
            navToggle.classList.add('active'); // Optional: For 'X' icon state
            navToggle.setAttribute('aria-expanded', 'true');
            body.classList.add('no-scroll'); // Prevent background scrolling
        }
    }

    // Function to close the menu
    function closeMenu() {
        if (mobileMenuOverlay && navToggle) {
            mobileMenuOverlay.classList.remove('active');
            mobileMenuOverlay.setAttribute('aria-hidden', 'true');
            navToggle.classList.remove('active'); // Optional: For 'X' icon state
            navToggle.setAttribute('aria-expanded', 'false');
            body.classList.remove('no-scroll'); // Allow scrolling again
        }
    }

    // Event listener for the hamburger toggle button
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Event listener for the close button inside the mobile menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Event listener for links inside the mobile menu (to close on navigation)
    mobileMenuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            // Close menu only if it's currently active
            if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
                closeMenu();
            }
            // Allow default link behavior to proceed
        });
    });

    //Optional: Close menu if clicking outside of it (more complex)
    document.addEventListener('click', (event) => {
        if (
            mobileMenuOverlay &&
            mobileMenuOverlay.classList.contains('active') &&
            !mobileMenuOverlay.contains(event.target) &&
            !navToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // --- Simple Scroll Animation (Keep existing code if you have it) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                    // Optional: Remove class if you want animation to reverse when scrolling up
                    // else { entry.target.classList.remove('is-visible'); }
                });
            },
            { threshold: 0.1 },
        );
        animatedElements.forEach((el) => {
            observer.observe(el);
        });
    }
});
