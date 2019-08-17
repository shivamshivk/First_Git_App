const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_getAll = (req,res,next)=>{
    User.find()
    .select('_id name email password')
    .exec()
    .then(doc =>{
        if(doc.length>=1){
            res.status(200).json({
                users:doc
            });
        }else{
            res.status(200).json({
                message: 'No Users Found'
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    })
}

exports.user_getByID = (req,res,next)=>{

    User.findById(req.params.userID)
    .select('name email password _id')
    .exec()
    .then(result =>{
        if(result){
            res.status(200).json({
                userDetails:result
            });
        }else{
            res.status(404).json({
                message : 'User NotFound'
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            error : err.message
        });
    });
    
}


exports.user_signup = (req,res,next) => {

    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }else{
            
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                name : req.body.name,
                email : req.body.email,
                password: hash
            });
            
            user.save()
            .then(result => {
                res.status(201).json({
                    message:'User Signed Up successfully'
                });
            })
            .catch(err =>{
                res.status(500).json({
                    error :err.message
                })
            });

        }
    });
}


exports.user_signIn =(req,res,next)=>{

    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            res.status(401).json({
                message :"Auth Failed"
            });
        }else{
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message :"Auth Failed"
                    });
                }

                if(result){

                    const token = jwt.sign(
                        {
                        email : user[0].email,
                        userID : user[0]._id
                        },process.env.JWT_KEY,{
                            expiresIn:'1h'
                        }
                    );

                    return res.status(200).json({
                        message :"Auth Success",
                        token :token
                    });
                }

                res.status(401).json({
                    message:'Auth Failed'
                });
            });
        }
    }).catch(err =>{
        res.status(500).json(
            {
                error:err.message
            }
        )
    })
}


exports.user_update = (req,res,next)=>{
    const id = req.params.userID;
    const updateOns = {};
    for (const ons of req.body){
        updateOns[ons.propName] = ons.value;
    }

    User.update({_id:id},{$set: updateOns })
    .exec()
    .then(result =>{
        const response = {
            message : 'User Updated ',
            request : {
                type :'GET',
                url : 'http://localhost:3000/users/'+id
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

exports.user_delete = (req,res,next)=>{
    User.remove({_id:req.params.userID})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Product deleted'
        });
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        });
    })
}

