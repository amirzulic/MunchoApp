var express = require('express');
var router = express.Router();
var config = {
    user: 'knvhaxgn', //env var: PGUSER
    database: 'knvhaxgn', //env var: PGDATABASE
    password: 'RfM1dMoVXnvHiWOQwe4T5EYTTNBy14Ul', //env var: PGPASSWORD
    host: 'rogue.db.elephantsql.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pg = require('pg');
var pool = new pg.Pool(config);
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/dostavljac', function(req, res, next) {
    res.render('adminDostavljac');
});

router.post('/postavi', function(req, res, next) {

    let ime = req.body.firstNameReg;
    let prezime = req.body.lastNameReg;
    let adresa = req.body.userAddressReg;
    let email = req.body.emailAddressReg;

    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.pwReg, salt, function (err, hash) {
                client.query(`INSERT INTO Korisnik(ime, prezime, adresa, email, hash, idVrstaKorisnika)
          VALUES ('${ime}', '${prezime}', '${email}', '${adresa}', '${hash}', '3');`, [], function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(500);
                    } else {
                        console.log(result.rows);
                        res.redirect('/');
                    }
                });
            });
        });
    });
});

router.get('/artikal', function(req, res, next) {
    res.render('dodajArtikal');
});

router.post('/ubaci', function(req, res, next) {
    let ime = req.body.artikalName;
    let cijena = req.body.artikalPrice;
    let slika = req.body.artikalPicture;
    let kategorija = req.body.artikalCategory;
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`INSERT INTO Artikal (naziv, cijena, slika, idKategorijaArtikal)
        values ('${ime}', '${cijena}', '${slika}', '${kategorija}');`, [], function(err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(500);
            } else {
                res.redirect('/');
            }
        });
    });
});

router.get('/ponuda', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`select * from Artikal;`, [], function(err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(500);
            } else {
                console.log(result.rows);
                artikli = result.rows;
                res.render('ponuda', { artikal: artikli});
            }
        });
    });
});

router.get('/restorani', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`SELECT * FROM Restoran;`, [], function(err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(500);
            } else {
                //console.log(result.rows);
                res.render('adminRestoranUpdate', { restoran: result.rows });
            }
        });
    });
});

router.get('/artikli', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`select * from Artikal;`, [], function(err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(500);
            } else {

                artikli = result.rows;
                var albumId = 'artikli';
                slike = [];
                /*for(let i = 0; i < artikli.length; i++) {
                    imgur.uploadBase64(artikli[i].slika , albumId)
                        .then(function (json) {
                            console.log(json.data.link);
                            slike.append(json.data.link[i]);
                        })
                        .catch(function (err) {
                            console.error(err.message);
                        });
                }*/

                res.render('adminRestoranArtikli', { artikal: artikli, slike: slike});
            }
        });
    });
});

module.exports = router;
