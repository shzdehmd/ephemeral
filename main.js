// Set up environment variables from the .env file.
require('dotenv').config();

// Import the NPM modules needed for the application.
const express = require('express');
const nunjucks = require('nunjucks');

// Setup the ExpressJS app instance.
const app = express();

// Initialize constants from environment variables or with default values.
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Import the middlewares
const { error404 } = require('./utils/middlewares');

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

// Render the homepage for the application.
app.get('/', (req, res) => res.render('index.html'));

// Use error404 as the final route handler if no other route satisfies the request.
app.use(error404);

// Start the application on the prescribed port and log the address
// to the console for web access.
app.listen(PORT, () => console.log(`Ephemeral is running on: http://${HOST}:${PORT}`));
