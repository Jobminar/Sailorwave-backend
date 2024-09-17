import express from 'express';
import userAddressController from '../user-address-controller/user.address.controller.js';

const router = express.Router();


router.post('/', userAddressController.createUserAddress);

router.get('/:userId', userAddressController.getUserAddressById);

router.get("/",userAddressController.getAllUserAddress)

router.patch('/:id', userAddressController.updateUserAddress);

router.delete('/:id', userAddressController.deleteUserAddress);

export default router;
