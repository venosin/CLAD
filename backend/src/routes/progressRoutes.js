import express from 'express';
import {
    updateProgress,
    getProgress,
    getAllUserProgress,
} from '../controllers/progressController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de progreso requieren autenticación
router.use(protect);

router.route('/')
    .post(updateProgress)
    .get(getAllUserProgress);

router.route('/:mediaId')
    .get(getProgress);

export default router;
