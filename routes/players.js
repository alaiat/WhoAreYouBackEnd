var express = require('express');
const {body, validationResult }= require("express-validator");
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players'])
var router = express.Router();



let remove = function(res, id, redirect=false){

    db.players.remove({id:parseInt(id)}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            console.log(result)
            res.redirect('/login');
        }
    });


}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', function(req, res, next) {
    if(req.session.admin){
        res.render('add', { errors: null });
    }else{
        res.send("You need to be an admin to add a player");
    }
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
            //id: newplayerid(),
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
        //console.log(newPlayer);
       // res.render('add', { errors: null });
        db.players.insert(newPlayer,(err, result) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/add')
            }
        })
    }

});
router.get('/ID', function(req, res, next) {
    if(req.session.admin){
        db.players.find((err, docs) => {
            if (err) {
                res.send(err);
            } else {
                res.render('showPlayers', {elements: docs})
            }
        })
    }else{
        res.send("You need to be an admin to see all players");
    }

});
router.get('/:id', function(req, res, next) {
    if(req.session.admin){
        db.players.findOne({id:parseInt(req.params.id)},(err, docs) => {
            if (err) {
                res.send(err);
            } else if (docs == null){
                res.send('Player not found');
            }else {
                res.render('showPlayers', {elements: [docs]})
            }
        })
    }else{
        res.send("You need to be an admin to see a player");
    }

});
router.get('/remove/:id', (req, res,next) => {
    if(req.session.admin){
        remove(res, req.params.id)
    }else{
        res.send("You need to be an admin to remove a player");
    }

})





module.exports = router;
