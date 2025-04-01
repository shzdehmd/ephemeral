// Set up environment variables from the .env file.
require('dotenv').config();

// Import the NPM modules needed for the application.
const express = require('express');
const shortid = require('shortid');
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
const Note = require('./models/Note');
Note.sync();

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
app.post('/create', async (req, res) => {
    // Extract note details from the request body.
    const { message, type, expiry, iv, encrypted } = req.body;

    // Check if a non-empty note message is provided.
    if (!message) return res.status(400).json({ error: 'You cannot provide an empty note.' });

    // Validate that the note type is either "onetime" or "timebased".
    if (!['onetime', 'timebased'].includes(type))
        return res.status(400).json({
            error: 'You provided an invalid type for the note. It can only be one of the following: onetime OR timebased.',
        });

    // For timebased notes, ensure an expiry date and time are provided.
    if (type === 'timebased' && !expiry)
        return res.status(400).json({
            error: 'Please provide an expiry date and time for timebased notes.',
        });

    // For encrypted notes, verify that an initialization vector (IV) is provided.
    if (encrypted && !iv)
        return res.status(400).json({
            error: 'Please provide an IV value for encrypted notes.',
        });

    // Create a new Note instance with the provided details.
    const note = new Note({
        slug: shortid.generate(), // Generate a unique slug identifier.
        message, // Store the note message.
        onetime: type === 'onetime', // Flag note as onetime if applicable.
        expiry: type === 'timebased' ? new Date(expiry) : null, // Set expiry for timebased notes.
        views: 0, // Initialize views count to 0.
        protected: encrypted, // Mark note as encrypted if needed.
        iv: encrypted ? iv : null, // Include IV only if the note is encrypted.
    });

    // Save the new note to the database.
    const createdNote = await note.save();

    // Respond with a success status and the generated note slug.
    return res.status(201).json({ success: true, slug: createdNote.slug });
});

app.get('/view/:slug', async (req, res) => {
    const slug = req.params.slug;
    const note = await Note.findOne({ where: { slug } });

    if (!note) return res.render('note.html', { note: { message: 'The note does not exist or has expired.' } });

    if (note.onetime) await Note.destroy({ where: { id: note.id } });

    if (note.onetime === false && new Date(note.expiry).getTime() < new Date().getTime()) {
        await Note.destroy({ where: { id: note.id } });
        return res.render('note.html', { note: { message: 'The note does not exist or has expired.' } });
    }

    res.render('note.html', { note });
});

// Use error404 as the final route handler if no other route satisfies the request.
app.use(error404);

// Start the application on the prescribed port and log the address
// to the console for web access.
app.listen(PORT, () => console.log(`Ephemeral is running on: http://${HOST}:${PORT}`));
