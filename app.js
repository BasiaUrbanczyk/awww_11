//Imports
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');


const sequelize  = require("./database");
const Wycieczka = require("./wycieczka");
const Zgloszenie = require("./zgloszenie");

Wycieczka.hasMany(Zgloszenie);
Zgloszenie.belongsTo(Wycieczka);

//Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use(bodyParser());

//Set views 
app.set('views', './views');
app.set('view engine', 'pug');


//tworznie wycieczek do bazy
sequelize
    .sync({force:true})
    .then(() => {
        Wycieczka.create({id: 0, nazwa: "Wycieczka 0", opis: "To jest opis wycieczki 0", krotki_opis: "To jest którki opis wycieczki 0",
                                            obrazek: "To jest obrazek wycieczki 0", cena: 3000, data_poczatku: '2020-07-10', data_konca: '2020-07-20', liczba_dostepnych_miejsc: 10 })
    })
    .then(() => {
        Wycieczka.create({id: 1, nazwa: "Wycieczka 1", opis: "To jest opis wycieczki 1", krotki_opis: "To jest którki opis wycieczki 1",
                                            obrazek: "To jest obrazek wycieczki 1", cena: 3000, data_poczatku: '2020-07-10', data_konca: '2020-07-20', liczba_dostepnych_miejsc: 5 })
    })
    .then(() => {
        Wycieczka.create({id: 2, nazwa: "Wycieczka 2", opis: "To jest opis wycieczki 2", krotki_opis: "To jest którki opis wycieczki 2",
                                            obrazek: "To jest obrazek wycieczki 2", cena: 3000, data_poczatku: '2020-07-10', data_konca: '2020-07-20', liczba_dostepnych_miejsc: 2})
    })
    .then(()=> {
        return Wycieczka.findAll();
    })
    .then((wycieczki) => {
        console.log("Dostępne wycieczki to: ", wycieczki);
    })

var wycieczka1 = {
    zdjecie: 'https://fwcdn.pl/fph/85/00/828500/823194.1.jpg',
    tytul: "Szczyt wszystkiego",
    opis: "Krótka wycieczka z wejściem na ten właśnie szczyt.",
    cena: 150029000
};

var wycieczka2 = {
    zdjecie: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Palme_cuba.jpg/1200px-Palme_cuba.jpg',
    tytul: "Dalekie morza",
    opis: "Mórz jest wiele, więc i opis może być dłuższy niż poprzednio. Atrakcji też może być nieco więcej.",
    cena: 150
};

var wycieczka3 = {
    zdjecie: 'https://upload.wikimedia.org/wikipedia/commons/8/88/New-York-Jan2005.jpg',
    tytul: "Miasto",
    opis: "Na świecie mamy jeszcze miasta, można je zwiedzać",
    cena: 4382090
};

var wyc = [wycieczka1, wycieczka2, wycieczka3]

app.get('/strona_glowna', (req, res) => {
    res.render('strona_glowna', {
        wycieczki: wyc
    });
});

app.get('', (req, res) => {
    res.render('strona_glowna', {
        wycieczki: wyc
    });
});

app.get('/strona', (req, res) => {
    res.render('strona', {
        wycieczki: wyc,
        id: req.query.id
    });
});

app.get('/formularz', (req, res) => {
    res.render('formularz', {
        wycieczki: wyc,
        id: req.query.id
    });
});

app.post('/obsluga', [
    body('fname')
        .notEmpty().withMessage('Proszę wprowadzić imię'),
    body('lname')
        .notEmpty().withMessage('Proszę wprowadzić nazwisko'),
    body('nr')
        .notEmpty().withMessage('Proszę wprowadzić email')
        .isEmail().withMessage('Proszę wprowadzić poprawny email'),
    body('liczba')
        .notEmpty().withMessage('Proszę wprowadzić liczbę osób')
        .isInt({min:1}).withMessage('Proszę wprowadzić poprawną liczbę osób')
    ], (req, res) => {

    const errors = validationResult(req);
    const wartosci = req.body
    if (!errors.isEmpty()) {
        //const wartosci = req.body
        const walidacje = errors.array()
        res.render('formularz', {
            wycieczki: wyc,
            id: req.query.id,
            wartosci,
            walidacje
        });
    }
    else {
        var liczbaChetnych;
        sequelize
            .sync()
            .then(() => {
                return Wycieczka.findOne({where: { id: req.query.id }});
            })
            .then((wyc) => {
                liczbaChetnych = wartosci['liczba'];
                var liczbaDostepnych = wyc.liczba_dostepnych_miejsc;
                console.log("Znaleziona wycieczka: ", wyc);
                console.log("Liczba dostępnych: ", liczbaDostepnych);
                console.log("Liczba chętnych: ", liczbaChetnych);

                if (liczbaChetnych > liczbaDostepnych) {
                    return 0;
                }
                else {
                    var imie = wartosci['fname']
                    var nazwisko = wartosci['lname']
                    var email = wartosci['nr']
                    var liczba = wartosci['liczba']
                    return wyc.createZgloszenie({ imie: imie, nazwisko: nazwisko, email: email, liczba_miejsc: liczba});
                }
            })
            .then((zgloszenie) => {
                if (zgloszenie === 0) {
                    console.log("Liczba chętnych jest wyższa niż dostępne miejsca");
                    res.render('strona', {
                        wycieczki: wyc,
                        id: req.query.id,
                        sukces: "Liczba chętnych jest większa niż liczba dostępnych miejsc ;("
                    });
                }
                else {
                    Wycieczka.decrement({liczba_dostepnych_miejsc: liczbaChetnych}, { where: { id: req.query.id }})
                    console.log("Zgloszenie to: ", zgloszenie);
                    res.render('strona', {
                        wycieczki: wyc,
                        id: req.query.id,
                        sukces: "Udało się zarezerwować wycieczkę!"
                    });
                }
            })
    }
});

//Listen on port 3000
app.listen(port, () => console.info('Listening on port '  + port))


