const mongoose = require('mongoose');
const Product = require('../models/product');


exports.product_getAll = (req,res,next) =>{

    Product.find()
    .select('name price productImage _id')
    .exec()
    .then(doc =>{
        const response = {
            count : doc.length,
            products : doc.map(doc =>{
                return{
                    id : doc._id,
                    name : doc.name,
                    price : doc.price,
                    productImage : doc.productImage,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/'+ doc._id
                    }
                }
            })
        }

        if(doc.length > 0){
            res.status(200).json(response);
        }else{
            res.status(404).json({message:"No Entries Found"});
        }
         
    }).catch(err => {
        console.log(err);
        res.status(200).json({error:err})
    });
}

exports.product_create = (req,res,next) =>{

    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name: req.body.name,
        price : req.body.price,
        productImage : req.file.path
    });

    product.save().then(result =>{
        res.status(201).json({
            message:'Product Created',
            createdProdut : result,
            request : {
                type : 'GET',
                url : 'http://localhost:3000/products/'+ result._id
            }            
        })
    }).catch(err => {
        res.status(500).json({
            error :err
        })
    });
}


exports.getProductByID = (req,res,next)=>{
 
    const id = req.params.productID;
     Product.findById(id).
     select('name price productImage _id ')
    .exec()
    .then(doc =>{
        const response = {
            count : doc.length,
            products:doc,
            request :{
                method :'GET',
                description:'get all products',
                url:'http://localhost:3000/products/'
            }
        }

        if(doc){
            res.status(200).json(response);    
        }else{
            res.status(404).json({message:"No Entry for given ID"});
        }
    }).catch(err => {
        console.log(err);
        res.status(200).json({error:err})
    });
}


exports.product_update = (req,res,next)=>{

    const id = req.params.productID;
    const updateOns = {};
    for (const ons of req.body){
        updateOns[ons.propName] = ons.value;
    }

    Product.update({_id:id},{$set: updateOns })
    .exec()
    .then(result =>{
        const response = {
            message : 'Product Updated ',
            request : {
                type :'GET',
                url : 'http://localhost:3000/products/'+id
            }
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        res.status(500).json({
            error :err
        })
    });
}


exports.product_delete = (req,res,next)=>{
    const id = req.params.productID;
    Product.remove({_id:id})
    .exec().
    then(result =>{
        res.status(200).json({
            message:'Product deleted',
            request :{
                type :'POST',
                description :'Add New products',
                url : 'http://localhost:3000/products/',
                body :{
                    name :'String',
                    price :'Number'
                }
            }
        });
    }).catch(err =>{
        res.status(500).json({error : err});
    });
    
}