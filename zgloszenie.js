const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("./database")

const Zgloszenie =  sequelize.define('Zgloszenie', {
    // Do uzupełnienia
    imie: {
        type: DataTypes.STRING
    },
    nazwisko: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    liczba_miejsc: {
        type: DataTypes.INTEGER
    }
}, {freezeTableName: true });

module.exports = Zgloszenie;