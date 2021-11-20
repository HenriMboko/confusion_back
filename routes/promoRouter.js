const express = require('express');
const PromoRouter = express.Router();
const Promotions = require('../models/promotions');
const BodyParser = require('body-parser');

PromoRouter.use(BodyParser.json());


const authenticate = require('../authenticate')

//get all promotions
PromoRouter.route('/')
    .get((req, res, next)=>{
        Promotions.find({})
            .then((promotions) =>{
                if(promotions != null){
                    res.statusCode = 200,
                    console.log("Operation Successfull");
                    res.json(promotions)
                }else{
                    err = new Error("Operation get All promotion failed  not found")
                    err.statusCode = 404;
                    return next(err)
                }
            }, (err) => next(err))
            .catch((err)=>next(err))
    })
    .put(authenticate.verifyUser,(req, res, next)=>{
        res.statusCode = 403;
        console.log("Operation not supported /promotions")
        res.end("Operation not supported /promotions")
    })
    .post(authenticate.verifyUser,(req, res, next)=>{
        Promotions.create(req.body)
            .then((promotions)=>{
                res.statusCode = 200;
                console.log("Create promotions successfull")
                res.json(promotions)
            }, (err)=>next(err))
            .catch((err)=>next(err))
    })
   .delete(authenticate.verifyUser,(req, res, next)=>{
       Promotions.remove({})
        .then((resp)=>{
            if(resp == null){
                err = new Error("promotions details not found");
                err.statusCode = 404;
                return next(err)
            }else if(resp != null ){
                res.statusCode = 200;
                console.log('Delete All promotions is done');
                res.json(resp)
            }else {
                err = new Error("promotions details not found");
                err.statusCode = 404;
                return next(err)
            }
        }, (err)=>next(err))
        .catch((err)=>next(err))
   }) 

// get promotions ID
PromoRouter.route('/:promoId')
    .get((req, res, next)=>{
        Promotions.findById(req.params.promoId)
            .then((promo)=>{
                res.statusCode = 200;
                console.log("prmotion by Id : "+req.params.promoId);
                res.json(promo)
            }, (err)=>next(err))
            .catch((err)=>next(err))
    })
    .put(authenticate.verifyUser,(req, res, next)=>{
        Promotions.findByIdAndUpdate(req.params.promoId, {$set : req.body}, {new : true})
            .then((promo)=>{
                res.statusCode = 200;
                console.log("Update promotions is successfull : " + req.params.promoId);
                res.json(promo)
            },(err)=>next(err))
            .catch((err)=>next(err))
    })
    .post(authenticate.verifyUser,(req, res, next)=>{
        res.statusCode = 403;
        res.end("Operation no supported /promotions by promoId : " + req.params.promoId)
    })
    .delete(authenticate.verifyUser,(req, res, next)=>{
        Promotions.findByIdAndRemove(req.params.promoId)
                .then((resp)=>{
                    if(resp != null){
                        res.statusCode = 200;
                         console.log("Delete promotions by Id :" + req.params.promoId)
                         res.json(resp)
                    }else{
                        err = new Error("Id promotion " + req.params.promoId + " not found");
                        err.statusCode = 404;
                        return next(err)
                    }
                },(err)=>next(err))
                .catch((err)=>next(err))
    })

module.exports = PromoRouter;