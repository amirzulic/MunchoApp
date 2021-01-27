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

/* GET users listing. */

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/korpa', function(req, res, next) {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`select a.naziv, a.cijena from Narudzba n
                inner join artikal a on n.idartikal = a.idArtikal;`, [], function (err, result) {
            done();
            if (err) {
                console.info(err);
                res.sendStatus(500);
            } else {
                console.log(result.rows);
                res.render('korpa', {narudzba: result.rows})
            }
        });
    });
});

router.post('/dodaj/:id', function(req, res, next) {

    let id = req.params.id;

    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }
                client.query(`INSERT INTO Narudzba(idartikal)
          VALUES ('${id}');`, [], function (err, result) {
                    done();
                    if (err) {
                        console.info(err);
                        res.sendStatus(500);
                    } else {
                        console.log(result.rows);
                    }
                });
    });
});



module.exports = router;
