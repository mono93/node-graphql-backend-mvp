import { Request, Response } from 'express';
import logger from '../common/logging';
import userService from '../common/service/user.service';

const saveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    await userService.saveUser(req.body);

    logger.log(`User saved: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User saved successfully',
    });
  } catch (error: any) {
    logger.error('Error saving user:', error);

    if (error.message === 'Email in use') {
      res.status(409).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Error saving user',
      error: process.env.NODE_ENV === 'production' ? undefined : error,
    });
  }
};

export { saveUser };
