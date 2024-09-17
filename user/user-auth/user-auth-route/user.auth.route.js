import express from 'express'
import userController from '../user-auth-controller/user.auth.controller.js'

const router=express.Router()

router.post("/generate-otp",userController.generateOtp)
router.post("/verify-otp",userController.verifyOtp)

export default router