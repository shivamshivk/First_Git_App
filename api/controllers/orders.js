const mongoose = require('mongoose');
const Order = require('../models/order');


exports.getAllOrders = (req,res,next)=>{

    Order.find()
   .select('_id product quantity')
   .populate('product','name _id')
   .exec()
   .then(doc =>{

       if(doc.length>0){
           const response = {
               count : doc.length,
               orders: doc.map(doc=>{
                   return {
                       id: doc._id,
                       product : doc.product,
                       quantity : doc.quantity,
                       request : {
                           type : 'GET',
                           description : 'Fetch Particular Order',
                           url : 'http://localhost:3000/orders/'+ doc._id
                       }
                   }
               })
   
           };
   
           res.status(200).json(response);
       }else{
           res.status(404).json({
               message : 'No Orders found..'
           });
       }

   }).catch(err =>{
       res.status(500).json({
           error :err.message
       });
   });
}


exports.order_create = (req,res,next)=>{
    const order = new Order({
        _id : new mongoose.Types.ObjectId,
        product : req.body.product,
        quantity : req.body.quantity
    });

    order.save()
    .then(result =>{
        const response = {
            message :'Order Placed',
            orderDetails : result,
            request :{
                type :'GET',
                description:'Fetch this order from the link below',
                url :'http://localhost:3000/orders/'+ result._id
            }
        }
        res.status(201).json(response);
    })
    .catch(err =>{
        res.status(500).json({
            error :err.message
        })
    });

}

exports.getOrderByID = (req,res,next)=>{

    Order.findById(req.params.orderID)
    .populate('product')
    .exec()
    .then(doc =>{
        const response = {
            orders:doc,
            request :{
                method :'GET',
                description:'get all products',
                url:'http://localhost:3000/orders/'
            }
        }

        if(doc){
            res.status(200).json(response);    
        }else{
            res.status(404).json({message:"No Entry for given ID"});
        }

    })
    .catch(err =>{
        res.status(500).json({
            error :err.message
        })
    });
    
}


exports.order_update = (req,res,next)=>{

    const id = req.params.orderID;
    const updateOns = {};
    for (const ons of req.body){
        updateOns[ons.propName] = ons.value;
    }

    Order.update({_id:id},{$set: updateOns })
    .exec()
    .then(result =>{
        const response = {
            message : 'Order Updated ',
            request : {
                type :'GET',
                url : 'http://localhost:3000/orders/'+id
            }
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        res.status(500).json({
            error :err.message
        })
    });
}


exports.order_delete = (req,res,next)=>{
    const id = req.params.orderID;
    
    Order.remove({_id:id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Order deleted',
            request :{
                type :'POST',
                description :'Create New products',
                url : 'http://localhost:3000/orders/',
                body :{
                    product_id :'String',
                    quantity :'Number'
                }
            }
        });
    }).catch(err =>{
        res.status(500).json({error : err.message});
    });
}