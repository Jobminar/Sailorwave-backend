import express from 'express';
import subadminController from '../sub-admin-controller/subadmin.controller.js'

const router = express.Router();

router.post('/signup', subadminController.createSubadmin);

router.post('/login',subadminController.login)

router.get('/', subadminController.getAllSubadmins);

router.patch('/:id', subadminController.updateSubadmin);

router.delete('/:id', subadminController.deleteSubadmin);

export default router;
