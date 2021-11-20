const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Shema = mongoose.Schema;

const commentShema = new Shema({
    rating:{
        type : Number,
        min : 1,
        max  : 5,
        required : true,
    },
    comment:{
        type : String,
        required : true,
    },
    author:{
        type : String,
        required : true,
    }
},{timestamps : true});

const dishesShema = new Shema({
    name : {
        type: String,
        required : true,
    },
    description :{
        type : String,
        required : true,
    },
    image :{    
        type : String,
        required : true
    },
    category :{
        type : String,
        required : true,
    },
    label :{
        type : String,
        default : '' 
    },
    price :{
        type : Currency,
        required : true,
        min : 0,
    },
    featured :{
        type :Boolean,
        default : true,
    },
    comments :  [commentShema]
},{timestamps : true})


const Dishes = mongoose.model('dishes', dishesShema);

module.exports = Dishes;