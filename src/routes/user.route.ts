import { Router } from 'express';
import { signUp, verifyEmail } from '../controllers/user.controller';

const router = Router();

router.post('/signup', signUp);
router.get('/verify/:confirmationToken', verifyEmail);

export { router as userRouter };
