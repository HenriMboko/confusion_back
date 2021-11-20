const express = require ('express');
const leadersRouter = express.Router();
const bodyParser = require('body-parser');
const Leaders  = require('../models/leaders');

const authenticate = require('../authenticate')


leadersRouter.use(bodyParser.json())



//get all leaders

leadersRouter.route('/')
    .get((req, res, next) =>{
        Leaders.find({})
         .then((leaders) =>{
             res.statusCode  = 200;
             console.log("Will details leaders");
             res.json(leaders)
         }, (err) => next(err))
         .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req, res, next)=>{
        Leaders.create(req.body)
        .then((leaders) =>{
            res.sendStatus = 200;
            console.log("creation successfull" + req.body);
            res.send(leaders)
        },(err) => next(err))
        .catch((err) =>next(err))
    })
    .put(authenticate.verifyUser,(req, res, next) =>{
        res.statusCode = 403;
        console.log("operation non supported");
        res.send("Operation PUT no supported");
    })
    .delete(authenticate.verifyUser,(req, res, next)=>{
        Leaders.remove({})
            .then((resp) =>{
                res.statusCode = 200;
                console.log("Remove leaders successfull");
                res.json(resp)
            }, (err)=>next(err))
            .catch((err)=>next(err))
    })

//get promotion leadersID

leadersRouter.route('/:leadersId')
    .get((req, res, next) =>{
            Leaders.findById(req.params.leadersId)
                .then((leaders)=>{
                    res.statusCode = 200;
                    console.log("Operations Succesfull ......");
                    res.json(leaders)
                }, (err) =>next(err))
                .catch((err)=>next(err))
        })
    
    .put(authenticate.verifyUser,(req, res, next)=>{
        Leaders.findByIdAndUpdate(req.params.leadersId ,{$set : req.body} , {new : true})
                .then((leader)=>{
                    res.statusCode = 200;
                    console.log("Operation Put succesfull by Id"+req.params.leadersId)
                    res.json(leader)
                },(err) => next (err))
                .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req,res, next) =>{
        res.statusCode = 403;
        console.log("Operation Pots by Id no Supported");
        res.send("Operation Pots by Id no Supported")
    })
.delete(authenticate.verifyUser,(req, res, next) =>{
    Leaders.findByIdAndDelete(req.params.leadersId)
        .then((resps)=>{
            res.statusCode = 200;
            console.log("Delete leaders by id : " + req.params.leadersId)
            res.send(resps)
        }, (err) => next(err))
        .catch((err)=>next(err))
})



module.exports = leadersRouter;