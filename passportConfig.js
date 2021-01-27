const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
var passport = require('passport');
var pg = require('pg');
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

passport.use(new LocalStrategy((username, password, done) => {
    pool.connect(function (err, client, done) {
        if (err) {
            res.end('{"error" : "Error", "status": 500}');
        }

        client.query(`select * from Korisnik where email = ${username};`, [], function (err, result) {
            done();
            if (err) {
                console.log(err);
            }
            if (result.rows.length > 0) {
                const user = result.rows[0];
                bcrypt.compare(password, user.hash, function (err, res) {
                    if (res) {
                        done(null, {id: user.id, email: user.email, ime: user.ime})
                    } else {
                        done(null, false)
                    }
                })
            } else {
                done(null, false);
            }
        });
    });
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        pool.connect(function (err, client, done) {
            if (err) {
                res.end('{"error" : "Error", "status": 500}');
            }

            client.query(`select * from Korisnik where idKorisnik = ${id};`, [], function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    return done(err)
                }

                done(null, results.rows[0]);
            })
        });
    });


    }));



