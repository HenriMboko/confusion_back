const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Shema = mongoose.Schema;


const LeadersShema = new Shema({
    name: {
        type : String ,
        required : true,
    },
    image: {
        type : String,
        required : true,
    },
    designation:{
        type : String,
        required : true,
    },
    abbr: {
         type : String,
        default : '',
    },
    featured: {
        type : Boolean,
        default : true,
    },
    description: {
        type : String,
        required : true,
    }
})

const Leaders = mongoose.model('leaders', LeadersShema);
 module.exports = Leaders ;
