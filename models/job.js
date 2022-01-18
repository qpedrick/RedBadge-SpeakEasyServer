const { DataTypes } = require('sequelize');
const db = require('../db');

const Job = db.define('job', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jobtitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Job;