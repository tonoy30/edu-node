import { Router } from 'express';
import { signUp } from '../controllers/user.controller';

const router = Router();
router.post('/signup', signUp);
export { router as userRouter };
