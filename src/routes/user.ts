import { Router } from 'express';
import { saveUser } from '../controller/save-user.controller';
import { authenticateUser } from '../middleware/authentication';
import { requireAdmin } from '../middleware/requireAdmin';

const userRouter = Router();

userRouter.post('/save-user', authenticateUser, requireAdmin, saveUser);

export default userRouter;
