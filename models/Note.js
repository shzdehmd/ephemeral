const sequelize = require('../utils/db');
const { DataTypes } = require('sequelize');

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    },
    onetime: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        require: true,
        defaultValue: true,
    },
    expiry: {
        type: DataTypes.DATE,
        allowNull: true,
        require: false,
        defaultValue: null,
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        require: true,
        defaultValue: 0,
    },
    protected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        require: true,
        defaultValue: false,
    },
    iv: {
        type: DataTypes.STRING,
        allowNull: true,
        require: true,
    },
});

module.exports = Note;
