var express = require('express');
var router = express.Router();
var pg = require('pg');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
let nodeGeocoder = require('node-geocoder');
var flash = require('connect-flash');
var mapboxgl = require('mapbox-gl');
var session = require('express-session');
let options = {
  provider: 'openstreetmap'
};

let geoCoder = nodeGeocoder(options);

var config = {
  user: 'knvhaxgn', //env var: PGUSER
  database: 'knvhaxgn', //env var: PGDATABASE
  password: 'RfM1dMoVXnvHiWOQwe4T5EYTTNBy14Ul', //env var: PGPASSWORD
  host: 'rogue.db.elephantsql.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 100, // max number of clients in the pool
  idleTimeoutMillis: 10, // how long a client is allowed to remain idle before being closed
};
var pool = new pg.Pool(config);
const bcrypt = require('bcrypt');
const saltRounds = 10;



/* GET home page. */
router.get('/', function(req, res, next) {
  pool.connect(function (err, client, done) {
    if (err) {
      res.end('{"error" : "Error", "status": 500}');
    }

        client.query(`select * from Artikal
             inner join KategorijaArtikal KA on Artikal.idKategorijaArtikal = KA.idKategorijaArtikal;`, [], function(err, result) {
          done();
          if (err) {
            console.info(err);
          } else {
            res.render('pocetna', { kategorija: result.rows });
          }
        });

  });

});

/*router.post('/', function(req, res, next) {
  let adresa = req.body.search;
  geoCoder.geocode(adresa)
      .then((res)=> {
        console.log(res);
      })
      .catch((err)=> {
        console.log(err);
      });
  res.redirect("/");
});*/

router.get('/adresa', function(req, res, next) {
  res.render('adresa', { title: 'Express' });
});

router.get('/prijava', function(req, res, next) {
  res.render('prijava', { title: 'Express' });
});

router.get('/registracija', function(req, res, next) {
  res.render('registracija', { title: 'Express' });
});

router.post('/ubaci', function(req, res, next) {

  let ime = req.body.firstNameReg;
  let prezime = req.body.lastNameReg;
  let lng = req.body.userLngReg;
  let ltd = req.body.userLtdReg;
  let email = req.body.emailAddressReg;


    pool.connect(function (err, client, done) {
      if (err) {
        res.end('{"error" : "Error", "status": 500}');
      }
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.pwReg, salt, function(err, hash) {

      client.query(`INSERT INTO Korisnik(ime, prezime, email, hash, idVrstaKorisnika, lng, ltd)
      VALUES ('${ime}', '${prezime}', '${email}', '${hash}', '4' ,'${lng}', '${ltd}');`, [], function(err, result) {
        done();
        if (err) {
          console.info(err);
        } else {
          res.redirect("/");
        }
          });
        });
    });
  });
});

router.post("/prijavi", passport.authenticate('local', {
  failureRedirect: "/prijava",
}), function(req, res) {
  console.log('request')
  res.redirect('/');
});



  passport.serializeUser((user, done) => {
    console.log("Proso" + user);
    done(null, user);
  });

  passport.deserializeUser((user, cb) => {
    pool.connect(function (err, client, done) {
      if (err) {
        res.end('{"error" : "Error", "status": 500}');
      }

      client.query(`select * from Korisnik where idKorisnik = ${user.id};`, [], function (err, results) {
        done();
        if (err) {
          console.log(err);
          return done(err);
        }
        cb(null, results.rows[0]);
      })
    });
  });

  passport.use('local', new LocalStrategy( (username, password, cb) => {

    loginAttempt();


    function loginAttempt() {
      pool.connect(function (err, client, done) {
        if (err) {
          res.end('{"error" : "Error", "status": 500}');
        }
        client.query(`select * from Korisnik where email = '${username}';`, [], function (err, result) {
          done();
          if (err) {
            console.log(err);
          }
          console.log(result.rows);
          console.log("Tu sam");
          if (result.rows.length > 0) {
            const user = result.rows[0];
            bcrypt.compare(password, user.hash, function (err, res) {
              if (res) {
                console.log("Dobar pw");
                console.log(user)
                cb(null, {id: user.idkorisnik, email: user.email, ime: user.ime});
              } else {
                cb(null, false);
              }
            })
          } else {
            cb(null, false);
          }
        });
      });
    }


  }));



module.exports = router;
