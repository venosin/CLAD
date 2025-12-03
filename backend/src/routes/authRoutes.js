import express from 'express';
import loginController from '../controllers/loginController.js';
import registerController from '../controllers/registerController.js';

const router = express.Router();

router.post('/login', loginController.login);
router.post('/register', registerController.register);

export default router;
