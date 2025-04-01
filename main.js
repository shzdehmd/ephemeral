// Set up environment variables from the .env file.
require('dotenv').config();

// Import the NPM modules needed for the application.
const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

// Setup the ExpressJS app instance.
const app = express();

// Initialize constants from environment variables or with default values.
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Import the middlewares.
const { error404 } = require('./utils/middlewares');

// Import the Note Model.

// Configure nunjucks as the templating engine with its templates stored
// in the views folder.
nunjucks.configure('views', {
    express: app,
    autoescape: true,
});
app.set('view engine', 'html'); // Tell Express to treat .html files as nunjucks templates.

// Set the public folder as the source for all static resources such as
// stylesheets, images, and javascript files for the frontend.
app.use(express.static('public'));

// Use body-parser to get the form data from the frontend for the note.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Render the homepage for the application.
app.get('/', (req, res) => res.render('index.html'));

// Get the note data from form post submit.
app.post('/create', (req, res) => {
    console.log(req.body);

    const { message, type, expiry, iv, encrypted } = req.body;

    if (!message) return res.status(400).json({ error: 'You cannot provide an empty note.' });

    if (!['onetime', 'timebased'].includes(type))
        return res.status(400).json({
            error: 'You provided an invalid type for the note. It can only be one of the following: onetime OR timebased.',
        });

    if (type === 'timebased' && !expiry)
        return res.status(400).json({
            error: 'Please provide an expiry date and time for timebased notes.',
        });

    if (encrypted && !iv)
        return res.status(400).json({
            error: 'Please provide an IV value for encrypted notes.',
        });

    return res.status(201).json({ success: true });
});

// Use error404 as the final route handler if no other route satisfies the request.
app.use(error404);

// Start the application on the prescribed port and log the address
// to the console for web access.
app.listen(PORT, () => console.log(`Ephemeral is running on: http://${HOST}:${PORT}`));
