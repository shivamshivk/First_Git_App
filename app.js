const express = require('express')
const app = express()
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://shivamshivl:'+ 
 process.env.MONGO_ATLAS_PAS +
 '@shivcluster-izobp.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true });

app.use(morgan('dev'));

app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded( {extended : false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With','Content-Type','Accept','Authorization') 
    if(req==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        res.status(200).json({});
    }
    next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500 ).json({
        error:{
            message : error.message
        }
    });
});



module.exports = app;