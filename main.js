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
    if (!['onetime', 'timebased', 'permanent'].includes(type))
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

// Defines a route for viewing a note based on its slug.
app.get('/view/:slug', async (req, res) => {
    // THE CODE FOR BLOCKING SOCIAL MEDIA BOTS WAS AI-GENERATED
    // USING CHATGPT.
    const userAgent = req.headers['user-agent'] || '';

    // List of known social media bots
    const socialMediaPatterns = [
        /facebookexternalhit/i, // Facebook crawler
        /Twitterbot/i, // Twitter bot
        /LinkedInBot/i, // LinkedIn bot
        /WhatsApp/i, // WhatsApp preview
        /TelegramBot/i, // Telegram bot
        /Discordbot/i, // Discord bot // THIS LINE IS NOT AI GENERATED
    ];

    // Check if User-Agent matches known social media bots
    if (socialMediaPatterns.some((pattern) => pattern.test(userAgent))) {
        return res.status(401).end(); // THIS LINE IS NOT AI GENERATED
    }
    // AI-GENERATED CODE ENDS HERE

    // Extract the slug from the request parameters.
    const slug = req.params.slug;

    // Look up the note in the database using the provided slug.
    const note = await Note.findOne({ where: { slug } });

    // If the note doesn't exist, render the template with an error message.
    if (!note)
        return res.render('note.html', {
            note: { message: 'The note does not exist or has expired.' },
        });

    // If it's a one-time note, delete it after retrieval.
    if (note.onetime) await Note.destroy({ where: { id: note.id } });

    // If it's a time-based note that has expired, remove it and notify the user.
    if (note.onetime === false && note.expiry !== null && new Date(note.expiry).getTime() < new Date().getTime()) {
        await Note.destroy({ where: { id: note.id } });
        return res.render('note.html', {
            note: { message: 'The note does not exist or has expired.' },
        });
    }

    // Update note view count
    note.views++;
    await note.save();

    // Render the note using the 'note.html' template.
    res.render('note.html', { note, views: note.views });
});

// Use error404 as the final route handler if no other route satisfies the request.
app.use(error404);

// Start the application on the prescribed port and log the address
// to the console for web access.
app.listen(PORT, () => console.log(`Ephemeral is running on: http://${HOST}:${PORT}`));
