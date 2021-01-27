var express = require('express');
var router = express.Router();
var pg = require('pg');
var imgur = require('imgur');


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


router.get('/', function(req, res, next) {

    function base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer(bitmap).toString('base64');
    }

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

                //console.log(artikli);
                //console.log(artikli[0].slika);
                res.render('artikal', { artikal: artikli, slika: base64str});
            }
        });
    });
});
module.exports = router;