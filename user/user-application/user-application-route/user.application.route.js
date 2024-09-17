import express from 'express';
import userApplicationController from '../user-application-controller/user.application.controller.js'

const router = express.Router();

router.post('/', userApplicationController.createUserApplication);

router.get('/', userApplicationController.getAllUserApplications);

router.get('/:id', userApplicationController.getUserApplicationById);

router.get('/user/:userId',userApplicationController.getUserApplicationByUserId)

router.patch('/:id', userApplicationController.updateUserApplication);

router.delete('/:id', userApplicationController.deleteUserApplication);

export default router;
