const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    storage: 'notes.db',
    dialect: 'sqlite',
    logging: console.log,
});

module.exports = sequelize;
