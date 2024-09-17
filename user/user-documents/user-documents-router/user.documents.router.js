import express from 'express';
import documentsController from '../user-documents-controller/user.documents.controller.js'

const router = express.Router();

router.post('/',documentsController.createDocuments);

router.get('/',documentsController.getAllUserIdDocuments)

router.get('/:userId',documentsController.getUserByIdDocuments)

router.delete('/:userId',documentsController.deleteDocuments)

export default router;
