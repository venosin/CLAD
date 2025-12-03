import express from 'express';
import { createDonation, getMyDonations, getAllDonations } from '../controllers/donationController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createDonation)
    .get(protect, admin, getAllDonations);

router.route('/my')
    .get(protect, getMyDonations);

export default router;
