import Router from 'express';
import educationController from '../user-educational-controller/user.educatinoal.controller.js'

const router = Router();

router.post('/', educationController.createEducation);

router.get('/', educationController.getAllEducation);

router.get('/:userId', educationController.getEducationById);

router.patch('/:id', educationController.updateEducation);

router.delete('/:id', educationController.deleteEducation);

export default router;