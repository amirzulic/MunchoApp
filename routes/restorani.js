var express = require('express');
var router = express.Router();
var pg = require('pg');
var mapboxgl = require('mapbox-gl');

var config = {
    user: 'knvhaxgn', //env var: PGUSER
    database: 'knvhaxgn', //env var: PGDATABASE
    password: 'RfM1dMoVXnvHiWOQwe4T5EYTTNBy14Ul', //env var: PGPASSWORD
    host: 'rogue.db.elephantsql.com', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 100, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);




router.get('/adresa', function(req, res, next) {
    res.render('adresa');

});

/* GET users listing. */
router.get('/', function(req, res, next) {
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
                res.render('restoran', { restoran: result.rows });
            }
        });
    });
});

router.get('/admin', function(req, res, next) {
    res.render('dodajRestoran');
});

router.post('/dodaj', function(req, res, next) {
    let naziv = req.body.restName;
    let grad = req.body.restCity;
    let adresa = req.body.restAddress;
    let brojZv = req.body.inlineRadioOptions;
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`INSERT INTO Restoran(naziv, adresa, grad, broj_zvjezdica)
      VALUES ('${naziv}', '${adresa}', '${grad}', '${brojZv}');`, [], function(err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(500);
                    } else {
                        console.log(result.rows);
                        res.redirect("/");
                    }
                });
            });
});

router.get('/:ime', function(req, res, next) {

    let ime = req.params.ime;

    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`SELECT * FROM Restoran where naziv = '${ime}';`, [], function(err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(500);
            }
            if (!(result.rows.length > 0)) {
                res.send("Restoran nije pronadjen!");
            } else {
                console.log(result.rows);
                res.render('restoranPrikaz', { restoran: result.rows, naziv: ime });
            }
        });
    });
});


module.exports = router;

