const mongoose = require('mongoose');
const Shema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const users =  new Shema({
    admin :{
        type : Boolean,
        default : true
    }
});

users.plugin(passportLocalMongoose);

const Users = mongoose.model('users', users);

module.exports = Users;