import { Router } from 'express';
import { saveUser } from '../controller/save-user.controller';

const userRouter = Router();

userRouter.post('/save-user', saveUser);

export default userRouter;
