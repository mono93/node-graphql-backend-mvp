import { Router } from 'express';
import { saveUser } from '../controller/save-user.controller';

const userRouter = Router();

// Future enhancement: Add authentication middleware here in the future
userRouter.post('/save-user', saveUser);

export default userRouter;
