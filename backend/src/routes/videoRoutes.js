import express from 'express';
import {
    getVideos,
    getVideoById,
    createVideo,
    updateVideo,
    deleteVideo,
} from '../controllers/videoController.js';
import { protect, admin, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(optionalProtect, getVideos)
    .post(protect, admin, createVideo);

router.route('/:id')
    .get(optionalProtect, getVideoById)
    .put(protect, admin, updateVideo)
    .delete(protect, admin, deleteVideo);

export default router;
