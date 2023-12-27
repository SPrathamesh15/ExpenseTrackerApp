// expenseRoutes.js
const express = require('express');
const forgotPasswordController = require('../controllers/forgotpassword');
const userAuthentication = require('../middleware/auth')
const router = express.Router();


router.post('/forgotpassword', userAuthentication.Authenticate, forgotPasswordController.forgotPassword);
module.exports = router;
