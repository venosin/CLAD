import express from 'express';
import { getMedia, createMedia, updateMedia, deleteMedia } from '../controllers/mediaController.js';
import { protect, admin, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(optionalProtect, getMedia)
    .post(protect, admin, createMedia);

router.route('/:id')
    .put(protect, admin, updateMedia)
    .delete(protect, admin, deleteMedia);

export default router;
