var express = require('express');
var router = express.Router();
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['userDB'])

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login',(req,res,next) => {

  /*if(req.session.userid){
    res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  }else*/
    res.render("login")
});

router.post('/user',(req,res,next) => {

  db.userDB.find((err, docs) => {
    if (err) {
      res.send(err);
    } else {
      let a=docs.filter(doc => req.body.username == doc.username && req.body.password == doc.password )
      console.log(a)
      if(a[0]!=null){
        req.session.userid=req.body.username;
        //console.log(req.session)
        res.redirect('/protected');
      }else{
        //res.send('Invalid username or password');
        res.render('form', {text:"Invalid username or password"})

      }
    }})

})

module.exports = router;
