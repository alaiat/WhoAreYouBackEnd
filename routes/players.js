var express = require('express');
const {body, validationResult }= require("express-validator");
const mongojs = require('mongojs')
const path= require("path");
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players'])
var router = express.Router();



let remove = function(res, id, redirect=false){

    db.players.remove({id:parseInt(id)}, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            console.log(result)
            //res.redirect('/login');
            res.render('remove')
        }
    });


}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/add', function(req, res, next) {
    if(req.session.admin){
        res.render('add', { add:null, errors: null });
    }else {
        res.send("You need to be an admin to add a player");
    }
});

router.get('/edit', function(req, res, next) {
    //if(req.session.admin){
        res.render('edit', { errors: null });
    //}else{
        res.send("You need to be an admin to edit a player");
    //}
});

router.post('/add',
    body('name').notEmpty().withMessage('name can not be empty'),
    body('birthdate').notEmpty().withMessage('birthdate can`t be empty').isDate({format: 'YYYY-MM-DD'}).withMessage('birthdate must be a date'),
    body('nationality').notEmpty().withMessage('nationality can not be empty'),
    body('teamId').notEmpty().withMessage('teamId can not be empty').isNumeric().withMessage('teamId must be a number'),
    body('position').notEmpty().withMessage('position can not be empty').isIn(['DF', 'MF', 'FW', 'GK','df','mf','fw','gk']).withMessage('position must be DF, MF, FW or GK'),
    body('number').notEmpty().withMessage('number can not be empty').isNumeric().withMessage('number must be a number'),
    body('leagueId').notEmpty().withMessage('leagueId can not be empty').isNumeric().withMessage('leagueId must be a number'),
    async function(req, res, next) {

    let errors = validationResult(req);
    //let newId=await newplayerid();

        var newPlayer = {
            id: null,
            name: req.body.name,
            birthdate: req.body.birthdate,
            nationality: req.body.nationality,
            teamId: req.body.teamId,
            position: req.body.position.toUpperCase(),
            number: req.body.number,
            leagueId: req.body.leagueId
        }
    if(errors.errors.length > 0){
        res.render('add', { add: null, errors: errors.array() });
    }else{
        createPlayer(newPlayer, 1).then((id) => {
            console.log(id + "dentro");
            res.render('add', { add: id, errors: null });
        }).catch((err) => {
            console.error(err);
        });




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



router.put('/edit',
    function(req, res, next){
       // let errors = validationResult(req);
/*
        if(errors.errors.length > 0){
            res.render('edit', { errors: errors.array() });
        }else{*/
            db.players.findAndModify({
                query: {id: parseInt(req.body.id)},
                update: {$set:  {
                    name: req.body.name,
                    birthdate: req.body.birthdate,
                    nationality: req.body.nationality,
                    teamId: req.body.teamId,
                    position: req.body.position.toUpperCase(),
                    number: req.body.number,
                    leagueId: req.body.leagueId
                }},
                new: true
            }, (err, result) => {
                if (err) {
                    res.send(err+"aa")
                } else {
                    console.log(result + "resultado");
                    res.redirect('./api/players/edit' );
                }
            })
        //}

});

async function newplayerid() {
    let randomNumber = Math.floor(Math.random() * 1000000) + 1;
    let docs = await db.players.findOne({ id: randomNumber });
    if (docs == null) {
        console.log(randomNumber + " random");
        return randomNumber;
    } else {
        console.log(randomNumber + "repetido");
        return newplayerid();
    }
}

router.get('/team/:id', function(req, res, next){
    let teamId = req.params.id;
    let src = "C:/Users/alaia/OneDrive/Documentos/alaia/uni-infor/3/ws/workspace-intelli/WhoAreYouBackEnd/public/backend/json/teamIDs/" + teamId + ".png";
    res.sendFile(src);
})

router.get('/nationality/:nation', function(req, res, next){
    let nation = req.params.nation;
    let src = "C:/Users/alaia/OneDrive/Documentos/alaia/uni-infor/3/ws/workspace-intelli/WhoAreYouBackEnd/public/backend/json/nationalities/" + nation + ".svg";
    res.sendFile(src);
})

router.get('/league/:id', function(req, res, next){
    let leagueId = req.params.id;
    let src = "C:/Users/alaia/OneDrive/Documentos/alaia/uni-infor/3/ws/workspace-intelli/WhoAreYouBackEnd/public/backend/json/leagues/" + leagueId + ".png";
    res.sendFile(src);
})
router.get('/player/:id', function(req, res, next){
    let playerId = req.params.id;
    let src = "C:/Users/alaia/OneDrive/Documentos/alaia/uni-infor/3/ws/workspace-intelli/WhoAreYouBackEnd/public/backend/json/players/" + playerId + ".png";
    res.sendFile(src);
})

function createPlayer(player, id) {
    return new Promise((resolve, reject) => {
        db.players.findOne({ id: id }, (err, docs) => {
            if (err) {
                reject(err);
            } else if (docs) {
                createPlayer(player, id + 1).then(resolve).catch(reject);
            } else {
                player.id = id;
                db.players.insert(player, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(player.id + " id");
                        resolve(player.id);
                    }
                });
            }
        });
    });
}





/*
    function createPlayer(player,id){
    db.players.findOne({id:id},(err, docs) => {
      if(err){
        console.log(err);
        }else if(docs){
          createPlayer(player,id+1)
      }else{
          player.id=id;
          db.players.insert(player,(err, result) => {
            if (err) {
                console.log(err)
            }
          })
          console.log(player.id + " id");
          return player.id;
      }
    })
    return player.id;
}
*/


module.exports = router;
