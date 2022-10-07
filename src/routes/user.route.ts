import { Router } from 'express';
import { login, signUp, verifyEmail } from '../controllers/user.controller';

const router = Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get('/verify/:confirmationToken', verifyEmail);

export { router as userRouter };
