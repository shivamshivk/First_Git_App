const express = require('express');
const router = express.Router();
const checkAuth = require('../middleare/check-auth');
const ordersController = require('../controllers/orders');

router.get('/',ordersController.getAllOrders);

router.post('/',ordersController.order_create);

router.get('/:orderID',ordersController.getOrderByID);

router.patch('/:orderID',ordersController.order_update);

router.delete('/:orderID',ordersController.order_delete);

module.exports = router;