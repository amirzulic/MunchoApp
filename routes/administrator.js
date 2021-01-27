var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;


/*router.get('/', function(req, res, next) {
    res.render('pocetna');
});*/

/* GET users listing. */
router.get('/admin-restoran', function(req, res, next) {
    res.render('adminRestoran');
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
          VALUES ('${ime}', '${prezime}', '${email}', '${adresa}', '${hash}', '2');`, [], function (err, result) {
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

module.exports = router;
