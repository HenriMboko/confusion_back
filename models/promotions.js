const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const Shema = mongoose.Schema;

const promotionShema = new Shema({
    name: {
        type : String,
        required : true,
    },
        image:{
            type : String,
            required : true,
        },
        label: {
            type : String,
            default : ''
        },
        price:{
            type : Currency,
            require : true,
            min : 0,
        },
        featured: {
            type : Boolean,
            default : true,
        },
        description:{
            type : String,
            required : true,
        }

});

const Promotions = mongoose.model('promotions', promotionShema);

module.exports = Promotions;



