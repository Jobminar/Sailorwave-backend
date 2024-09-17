import express from 'express';
import adminController from '../admin-auth-controller/admin.auth.controller.js'

const router = express.Router();

// Route for creating an admin

// Route for sending OTP to admin
router.post('/send-otp', adminController.signup);

router.post('/login',adminController.login)

// Route for verifying OTP
router.post('/verify-otp', adminController.forgotPassword);

// Route for updating an admin
// router.patch('/:id', adminController.);

export default router;
