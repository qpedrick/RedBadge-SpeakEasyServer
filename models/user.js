const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    member: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'general',
    }
})

module.exports = User;