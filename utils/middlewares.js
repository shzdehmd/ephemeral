const error404 = (req, res) => res.status(404).render('404.html');

module.exports = { error404 };
