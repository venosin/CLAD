import express from 'express';
import passwordController from '../controllers/passwordController.js';

const router = express.Router();

router.post('/request-reset', passwordController.requestReset);
router.post('/verify-code', passwordController.verifyCode);
router.post('/reset', passwordController.resetPassword);

export default router;
