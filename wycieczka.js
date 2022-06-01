const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require("./database")

const Wycieczka = sequelize.define('Wycieczka', {
    nazwa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    opis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    krotki_opis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    obrazek: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cena: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    data_poczatku: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_konca: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isGreaterThanOtherField(value) {
                if (parseInt(value) < parseInt(this.data_poczatku)) {
                    throw new Error('Data końca musi być późniejsza niż data początku.');
                }
            }
        }
    },
    liczba_dostepnych_miejsc: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {freezeTableName: true });

module.exports = Wycieczka;