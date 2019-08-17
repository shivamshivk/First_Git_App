const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleare/check-auth');
const productsController = require('../controllers/products'); 


const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename : function(req,file,cb){
        cb(null,new Date().toISOString + file.originalname);
    }
});

const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'jpg' || file.mimetype === 'jpeg' || file.mimetype === 'png'){
        cb(null,true);
    }else{
        cb(null,true);
    }
}

const upload = multer({storage :storage,
    limits: {
        fileSize :1024 * 1024 * 5
    },
    fileFilter:fileFilter
});


router.get('/',productsController.product_getAll);

router.post('/',checkAuth, upload.single('productImage'),productsController.product_create);

router.get('/:productID',productsController.getProductByID);

router.patch('/:productID',checkAuth,productsController.product_update);

router.delete('/:productID',checkAuth,productsController.product_delete);

module.exports = router;