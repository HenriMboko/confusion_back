const express  = require('express')
const dishesrouter = express.Router();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const authenticate = require('../authenticate');
//body-parser parameter
dishesrouter.use(bodyParser.json());


//router function
dishesrouter.route('/')
.get((req, res, next)=>{
    Dishes.find({})
        .then((dishes) =>{
            res.statusCode = 200;
            res.json(dishes)
        },(err) =>next(err))
        .catch((err) =>next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
   Dishes.create(req.body)
        .then((dish) =>{
            console.log("dishes create", dish);
            res.statusCode = 200
            res.json(dish)
        }, (err) => next(err))
        .catch((err) =>next(err));
})
.put(authenticate.verifyUser,(req, res) =>{
    res.statusCode = 403;
    res.end('Put operation no supported on /dishes');
})
.delete(authenticate.verifyUser,(req, res, next) =>{
   Dishes.remove({})
    .then((resp) =>{
        console.log('Remove succesfull');
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err))
});


// router functin dishesId

dishesrouter.route("/:dishId")
    .get((req , res, next )=>{
        Dishes.findById(req.params.dishId)
            .then((dish) =>{
                console.log("Will details dishes Id :" + req.params.dishId + "to you");
                res.json(dish)
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req ,res ,next) =>{
        res.statusCode = 403;
        res.end('Put operation no supported on /dishes');
    })
    .put(authenticate.verifyUser,(req ,res ,next) =>{
        Dishes.findByIdAndUpdate(req.params.dishId ,{$set : req.body} , {new : true})
            .then((dish) =>{
             console.log("Will details dishes Id :" + req.params.dishId + "to you");
             res.json(dish)
            },(err) => next(err))
            .catch((err) => next(err))
})
    .delete(authenticate.verifyUser,(req, res, next) =>{
         Dishes.findByIdAndRemove(req.params.dishId)
            .then((resp) =>{
             console.log('Remove succesfull');
             res.json(resp)
             }, (err) => next(err))
            .catch((err) => next(err))
})


//get All /:dishID/comments
dishesrouter.route('/:dishId/comments')
.get((req, res, next)=>{
    Dishes.findById(req.params.dishId)
        .then((dish) =>{
            if(dish != null){
                res.statusCode = 200;
                res.json(dish.comments)  
            }else{
                err = new Error("Dish " +req.params.dishId + " not Found");
                err.statusCode = 404;
                return next(err)
            }
        },(err) =>next(err))
        .catch((err) =>next(err));
})
.post(authenticate.verifyUser,(req, res, next) =>{
   Dishes.findById(req.params.dishId)
        .then((dish) =>{
            if(dish != null){
               dish.comments.push(req.body);
               dish.save()
               .then((dish)=>{
                console.log("dishes ", dish);
                res.statusCode = 200
                res.json(dish)
               },(err) => next(err))
            }else{
                err = new Error("Dish " +req.params.dishId +" not found");
                err.statusCode = 404;
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) =>next(err));
})
.put(authenticate.verifyUser,(req, res) =>{
    res.statusCode = 403;
    res.end('Put operation not supported on /dishes/'+req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser,(req, res, next) =>{
   Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null){
            for(var i = (dish.comments.length -1); i>=0; i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
             console.log("dishes ", dish);
             res.statusCode = 200
             res.json(dish)
            },(err) => next(err))

        }else{
                err = new Error("Dish " +req.params.dishId +" not found");
                err.statusCode = 404;
                return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
});

// router functin /:dishesId/comments/:commentID

dishesrouter.route("/:dishId/comments/:commentId")
    .get((req , res, next )=>{
        Dishes.findById(req.params.dishId)
            .then((dish) =>{
                if(dish != null && dish.comments.id(req.params.commentId) != null){
                    console.log("Will details comments Id :" + req.params.commentId + " to you");
                    res.statusCode = 200;
                    res.json(dish.comments.id(req.params.commentId))  
                }else if(dish == null){
                    err = new Error("Dish " + req.params.dishId + " not Found");
                    err.statusCode = 404;
                    return next(err)
                }else{
                    err = new Error("Dish " + req.params.commentId + " not Found");
                    err.statusCode = 404;
                    return next(err)
                }
            },(err) => next(err))
            .catch((err) => next(err))
    })
    .post(authenticate.verifyUser,(req ,res ,next) =>{
        res.statusCode = 403;
        res.end('Put operation no supported on /dishes ' + req.params.dishId + ' /comments ' 
        + req.params.commentId);
    })
    .put(authenticate.verifyUser,(req ,res ,next) =>{
        Dishes.findById(req.params.dishId)
            .then((dish) =>{
                if(dish != null && dish.comments.id(req.params.commentId) != null){
                  if(req.body.rating){
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                  }
                  if(req.body.comment){
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                  }
                    dish.save()
                    .then((dish)=>{
                        res.statusCode = 200;
                        console.log("Put comment is succesfull" + req.params.commentId);
                        res.json(dish)
                    },(err)=>next(err))
                }else if(dish == null){
                    err = new Error("Dish " + req.params.dishId + " not Found");
                    err.statusCode = 404;
                    return next(err)
                }else{
                    err = new Error("Dish " + req.params.commentId + " not Found");
                    err.statusCode = 404;
                    return next(err)
                }
            },(err) => next(err))
            .catch((err) => next(err))
})
    .delete(authenticate.verifyUser,(req, res, next) =>{
        Dishes.findById(req.params.dishId)
        .then((dish) =>{
            if(dish != null && dish.comments.id(req.params.commentId) != null){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish)=>{
                 console.log("dishes ", dish);
                 res.statusCode = 200
                 res.json(dish)
                },(err) => next(err))
    
            }else if(dish==null){
                    err = new Error("Dish " +req.params.dishId +" not found");
                    err.statusCode = 404;
                    return next(err)
            }else{
                err = new Error("Dish " +req.params.commentId +" not found");
                err.statusCode = 404;
                return next(err)
            }
        }, (err) => next(err))
        .catch((err) => next(err))
})


module.exports = dishesrouter;