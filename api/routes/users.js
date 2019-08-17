const express = require('express');
const router = express.Router();
const checkAuth = require('../middleare/check-auth');
const usersController = require('../controllers/users');


router.get('/',usersController.user_getAll);

router.post('/signup',usersController.user_signup);

router.get('/:userID',checkAuth,usersController.user_getByID);

router.post('/login',checkAuth,usersController.user_signIn);

router.patch('/:userID',checkAuth,usersController.user_update);

router.delete('/:userID',checkAuth,usersController.user_delete);

module.exports = router;