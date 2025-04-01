# Ephemeral

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](package.json)

Ephemeral is a private note-sharing service built with Node.js, Express, Sequelize, and Nunjucks. It allows users to create notes with various privacy and expiry options.

**Homepage:** [https://ephemeral.shahzad.dev](https://ephemeral.shahzad.dev)

**Repository:** [https://github.com/shzdehmd/ephemeral](https://github.com/shzdehmd/ephemeral)

## Features

Ephemeral supports creating notes with the following characteristics:

-   **Standard Notes:** Simple text notes shareable via a unique link.
-   **One-Time View Notes:** Notes that are intended to be deleted or become inaccessible after being viewed once.
-   **Time-Based Expiry Notes:** Notes that expire after a user-specified date and time.
-   **Password-Protected Notes:** Notes can be protected with a password.
    -   **Client-side encryption/decryption** is used for these notes. The note content is stored encrypted in the database, along with an initialization vector (IV). No passwords or unencrypted note content is ever sent to the backend.

## Technology Stack

-   **Backend:** Node.js, Express.js
-   **Database:** SQLite
-   **ORM:** Sequelize
-   **Templating Engine:** Nunjucks
-   **Frontend Styling:** Pico.css, Custom CSS (`public/css/styles.css`)
-   **Frontend Logic:** Vanilla JavaScript (handling form interactions, password visibility, client-side cryptography, modal display)
-   **ID Generation:** `shortid` (used for note urls)
-   **Environment Variables:** `dotenv`
-   **Development:** `nodemon` for auto-reloading

## Project Structure

```
ephemeral/
├── models/           // Contains database models
│   └── Note.js       // Defines the Note model
├── public/           // Static assets (CSS, JS)
│   ├── css/
│   │   ├── reset.css // CSS reset file
│   │   └── styles.css// Custom styling
│   └── js/
│       ├── crypto.js      // Cryptography functions for client-side encryption/decryption
│       ├── formHandler.js // Manages form interactions on the index page
│       ├── index.js       // Main JavaScript for the index page
│       └── noteHandler.js // Handles note viewing logic, including decryption
├── utils/            // Utility functions and middleware
│   ├── db.js         // Sets up the Sequelize database connection
│   └── middlewares.js// Contains Express middleware functions
├── views/            // Nunjucks templates for HTML rendering
│   ├── 404.html      // Template for 404 error page
│   ├── index.html    // Template for the main note creation form
│   └── note.html     // Template for displaying notes or password prompts
├── .gitignore        // Specifies files/directories git should ignore
├── main.js           // Main application entry point
├── package.json      // Contains project metadata and dependencies
├── package-lock.json // Dependency lock file ensuring consistent installs
└── README.md         // This file: project documentation and usage guide
```

## Setup and Running

**Prerequisites:**

-   Node.js (built with v22.14.0)
-   npm (built with v10.9.2)

**Installation:**

1.  Clone the repository:
    ```bash
    git clone https://github.com/shzdehmd/ephemeral.git
    ```
2.  Navigate into the project directory:
    ```bash
    cd ephemeral
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

**Running the Application:**

-   **Development Mode** (with auto-reload on file changes):

    ```bash
    npm run dev
    ```

    This uses `nodemon` to monitor `.html`, `.css`, `.js`, and `.json` files.

-   **Production Mode:**
    ```bash
    npm start
    ```
    This runs the application using `node main.js`.

_(Note: You might need to configure a `.env` file depending on how database paths or other settings are handled in `main.js`)_

## How It Works (Conceptual Flow)

1.  **Creation:** A user fills out the form on the index page, selecting the note type (one-time, time-based) and optionally enabling password protection.
2.  **Submission:** The form data (including the message and options) is sent to the backend (`/create` endpoint).
3.  **Processing (Backend - Inferred):**
    -   A unique ID (using `shortid`) is generated for the note.
    -   If password protection is enabled, the frontend encrypts the message and sends the message encrypted for storage. It stores the IV if client-side crypto is used.
    -   Note details (ID, message/encrypted message, type, expiry, protected status, IV) are saved to the database via Sequelize.
    -   The unique note slug is generated (e.g., `{shortid}`).
4.  **Link Display:** The generated slug is sent back to the user and displayed in a modal on the frontend as a link (e.g., `yourdomain.com/view/{shortid}`).
5.  **Viewing:**
    -   When someone accesses the unique link (`/view/{shortid}`), the backend retrieves the note data.
    -   The `note.html` template is rendered.
    -   **If password-protected:**
        -   The page shows a password prompt modal.
        -   The encrypted message and IV are embedded in the page.
        -   `noteHandler.js` and `crypto.js` handle taking the user's password input, attempting decryption, and displaying the result.
    -   **If not protected:** The note content is displayed directly.
    -   **Expiry Logic (Backend - Inferred):** The backend check if the note is expired (either by view count for 'one-time' or by timestamp for 'time-based') _before_ rendering the note. If expired, it shows an appropriate message.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file (if present) or [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT) for details.

## AI Usage

-   GitHub Copilot was used to convert existing, non-AI code from a separate NodeJS backend project into web-specific functionality in the public/js/crypto file.
-   Additionally, AI assisted in writing around 70% of the code comments across the application. All AI-generated comments were thoroughly proof-read and verified for accuracy.
-   Furthermore, Google's Gemini Pro 2.5 (experimental) model was used to generate this README.md file. The file was proof-read and updated for accuracy.

## Author

-   **Ahmad Shahzad** - [shahzad.dev](https://shahzad.dev)

---
