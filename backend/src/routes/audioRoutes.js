import express from 'express';
import {
    getAudios,
    getAudioById,
    createAudio,
    updateAudio,
    deleteAudio,
} from '../controllers/audioController.js';
import { protect, admin, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(optionalProtect, getAudios)
    .post(protect, admin, createAudio);

router.route('/:id')
    .get(optionalProtect, getAudioById)
    .put(protect, admin, updateAudio)
    .delete(protect, admin, deleteAudio);

export default router;
