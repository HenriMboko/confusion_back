const passport = require('passport');
const localStrategy= require('passport-local').Strategy;
const Users = require('./models/users');
const JWtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const ExtractJwt = require('passport-jwt').ExtractJwt;


var config = require('./config');



exports.local = passport.use(new localStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());



exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});

};

var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JWtStrategy(opts,
    function(jwt_payload, done){
        console.log("JWT payload :", jwt_payload);
        Users.findOne({_id: jwt_payload._id}, (err, users)=>{
            if(err){
                return done(err, false); 
            }else if(users){
                return done(null, users );
            }else{
                return done(null, false);
            }

        })
    }));

    exports.verifyUser = passport.authenticate('jwt', {session: false});
