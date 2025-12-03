import express from 'express';
import userController from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, userController.getAllUsers);

router.get('/profile', protect, userController.getUserProfile);

router.route('/:id')
    .get(protect, admin, userController.getUserById)
    .put(protect, admin, userController.updateUser)
    .delete(protect, admin, userController.deleteUser);

export default router;
