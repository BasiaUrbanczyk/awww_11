const Sequelize = require('sequelize');

// Połączenie z bazą danych
const sequelize = new Sequelize('sqlite::memory:');

module.exports = sequelize;

// const get_db = async () => {
//     try {
//
//         // Sprawdzenie poprawności połączenia ]
//
//         await sequelize.authenticate();
//         console.log('Connection to the database has been established successfully.');
//
//         const db = {};
//
//         db.sequelize = sequelize;
//
//         // Uzupełnij treść modułu wycieczka.js implementującego model Wycieczka
//         db.Wycieczka = require("./wycieczka.js")(sequelize, Sequelize, DataTypes);
//
//         // Uzupełnij treść modułu zgloszenie.js implementującego model Zgloszenie
//         db.Zgloszenie = require("./zgloszenie.js")(sequelize, Sequelize, DataTypes);
//
//         // Tu dodaj kod odpowiedzialny za utworzenie relacji pomiędzy modelami db.Wycieczka i db.Zgloszenie
//
//         db.Wycieczka.hasMany(db.Zgloszenie);
//         db.Zgloszenie.belongsTo(db.Wycieczka);
//         // Synchronizacja
//         var wycieczka_plz //wycieczka
//         await db.sequelize
//             .sync({force: true})
//             .then((result) => {
//                 db.Wycieczka.create({id: 1, nazwa: "Wycieczka 1", opis: "To jest opis wycieczki 1", krotki_opis: "To jest którki opis wycieczki 1",
//                                            obrazek: "To jest obrazek wycieczki 1", cena: 3000, data_poczatku: '2020-07-10', data_konca: '2020-07-20', liczba_dostepnych_miejsc: 10 })
//                 console.log(result);
//             })
//             .then(wyc => {
//                 wycieczka_plz = wyc;
//                 // console.log("Pierwsza wycieczka zrobiona: ", wyc);
//                 return Zgloszenie.create({ imie: "xd", nazwisko: "dd", email: "basia@gmail.com", liczba_miejsc: 3});
//             })
//             .then(zglosz => {
//                 wycieczka_plz.createZgloszenie(zglosz);
//             })
//
//         return db;
//     } catch (error) {
//         console.error(error.message);
//         throw error;
//     }
// };
//
// module.exports = get_db;