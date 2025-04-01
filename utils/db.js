// Import Sequelize from the sequelize package
const { Sequelize } = require('sequelize');

// Create a new Sequelize instance with sqlite dialect
// 'storage' specifies the SQLite database file
// 'dialect' sets the database dialect to sqlite
// 'logging' enables logging of SQL queries to the console
const sequelize = new Sequelize({
    storage: 'notes.db', // SQLite database file
    dialect: 'sqlite', // Setting the dialect to SQLite
    logging: console.log, // Log SQL queries to the console
});

// Export the sequelize instance for use in other parts of the application
module.exports = sequelize;
