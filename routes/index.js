var express = require('express');
var router = express.Router();
const {body, validationResult }= require("express-validator");
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['registeredUsers'])

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login',(req,res,next) => {
  if(req.session.useremail){
    db.registeredUsers.findOne({email:req.session.useremail},(err,doc) => {
        if(err){
            res.send(err);
        }else{
            console.log(doc);
            res.render('userOptions',{admin:doc.admin});
        }
    })
  }else
    res.render("login", {text: ""});
});

router.post('/user',(req,res,next) => {
  db.registeredUsers.find((err, docs) => {
    if (err) {
        res.send(err);
    } else {
      let a=docs.filter(doc => req.body.email == doc.email && req.body.password == doc.password )
      if(a[0]!=null){
        req.session.useremail=req.body.email;
        req.session.admin=a[0].admin;
        console.log(req.session)
        res.redirect('/login');
      }else{
        //res.send('Invalid username or password');
        res.render('login', {text:"Invalid username or password"})

      }
    }})

})
router.get('/logout',(req,res,next) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/register',(req,res,next) => {
    if(req.session.useremail){
        db.registeredUsers.findOne({email:req.session.useremail},(err,doc) => {
            if(err){
                res.send(err);
            }else{
                console.log(doc);
                res.render('userOptions',{admin:doc.admin});
            }
        })
    }else
        res.render("register", {errors: null});
});

router.post('/register',
    body('izena').notEmpty().withMessage('izena can not be empty'),
    body('abizena').notEmpty().withMessage('abizena can not be empty'),
    body('email').notEmpty().withMessage('email can not be empty').isEmail().withMessage('email must be valid'),
    (req,res,next) => {
        let errors = validationResult(req);
        let newUser = {
            izena: req.body.izena,
            abizena: req.body.abizena,
            email: req.body.email,
            password: req.body.pasahitza,
            admin: false
        }
        if(errors.errors.length > 0){
            res.render('register', {errors: errors.errors});
        }else{
            db.registeredUsers.findOne({email:req.body.useremail},(err, docs) => {
                if (err) {
                    res.send(err);
                } else {
                    console.log(docs);
                    if(docs==null){
                        console.log("not found")
                        db.registeredUsers.insert(newUser,(err,doc) => {
                            if(err){
                                res.send(err);
                            }else{
                                req.session.useremail=req.body.email;
                                req.session.admin=false;
                                res.redirect('/login');
                            }

                        })
                    }else{
                        console.log("found")
                        res.render('register', {errors:[{msg:"That email is already registered"}]})

                    }
                }})
        }


})

module.exports = router;
