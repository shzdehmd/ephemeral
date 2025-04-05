// Middleware to handle 404 routes.
const error404 = (req, res) => res.status(404).render('404.html', { url: process.env.URL });

module.exports = { error404 };
