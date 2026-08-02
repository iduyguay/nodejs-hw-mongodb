import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authSchemas } from '../schemas/auth.js';
import { authController } from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.post('/register', validateBody(authSchemas.registerSchema), ctrlWrapper(authController.register));
router.post('/login', validateBody(authSchemas.loginSchema), ctrlWrapper(authController.login));
router.post('/refresh', ctrlWrapper(authController.refresh));
router.post('/logout', ctrlWrapper(authController.logout));

export default router;