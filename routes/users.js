var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Users = require('../models/users');
var passport = require('passport');

var authenticate = require('../authenticate');


router.use(bodyParser.json());


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req, res, next)=>{
    Users.register(new Users({username : req.body.username}),
     req.body.password,(err, users)=>{
            if(err){
              res.statusCode = 500;
              res.setHeader('Content-Type','application/json');
              res.json({message : 'ERROR', err : err})

            }else{
              /* return Users.create({
                username : req.body.username,
                password : req.body.password
              }) */
              passport.authenticate("local")(req, res, () => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json({success :true , message: "Registration Successfull", users: users });
              });
            }
        })
});


//Login with passport authneticate

router.post('/login', passport.authenticate("local"),function(req,res, next){
  
  var token = authenticate.getToken({_id: req.user._id});
  
  
   res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({success :true , token : token, message: "you are succesfully logged in !"});

});


/* router.post('/login', function(req, res, next){

  if(!req.session){
    var authHeaders = req.headers.authorization;

  if(!authHeaders){
    var err = new Error("You are not AUthenticated");
    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    return next(err);
  }
  var auth = new Buffer.from(authHeaders.split(' ')[1], 'base64').toString().split(':');
  var username = auth[0];
  var password = auth[1];

  Users.findOne({username : username})
    .then((user)=>{
        if(user === null){
          var err = new Error("User " + username + " does not existe ");
          err.status = 403;
          return next(err);
        }else if(user.password !== password){
          var err = new Error("Your Password is not correct ");
          err.status = 403;
          return next(err);
        }
        else if(user.username == username && user.password == password){
          req.session = 'authenticated';
          res.statusCode = 200;
          res.send('You are authenticated')
         }
    },(err)=>next(err))
    .catch((err)=>next(err))
  }else{
    res.statusCode = 200;
    res.send('You are already authenticated ')
  }
}); */

router.get('/logout', function(req, res, next){
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }else{
    var err = new Error("Your are not logger in !");
    err.status = 403;
    return next(err)
  }
})


module.exports = router;
