var express = require('express');
const {body, validationResult }= require("express-validator");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', function(req, res, next) {
  res.render('add', { errors: null });
});

router.post('/add',
    body('name').notEmpty().withMessage('name can not be empty'),
    body('birthdate').notEmpty().withMessage('birthdate can`t be empty').isDate({format: 'DD-MM-YYYY'}).withMessage('birthdate must be a date'),
    body('nationality').notEmpty().withMessage('nationality can not be empty'),
    body('teamId').notEmpty().withMessage('teamId can not be empty').isNumeric().withMessage('teamId must be a number'),
    body('position').notEmpty().withMessage('position can not be empty').isIn(['DF', 'MF', 'FW', 'GK','df','mf','fw','gk']).withMessage('position must be DF, MF, FW or GK'),
    body('number').notEmpty().withMessage('number can not be empty').isNumeric().withMessage('number must be a number'),
    body('leagueId').notEmpty().withMessage('leagueId can not be empty').isNumeric().withMessage('leagueId must be a number'),
    function(req, res, next) {

    let errors = validationResult(req);

        var newPlayer = {
            name: req.body.name,
            birthdate: req.body.birthdate,
            nationality: req.body.nationality,
            teamId: req.body.teamId,
            position: req.body.position.toUpperCase(),
            number: req.body.number,
            leagueId: req.body.leagueId
        }
    if(errors.errors.length > 0){
        res.render('add', { errors: errors.array() });
    }else{
        console.log(newPlayer);
        res.render('add', { errors: null });
    }

});
router.get('/ID', function(req, res, next) {
    db.players.find((err, docs) => {
        if (err) {
            res.send(err);
        } else {
            res.render('showPlayers', {elements: docs})
        }
    })
});



module.exports = router;
