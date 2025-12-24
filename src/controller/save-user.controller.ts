import { Request, Response } from 'express';
import logger from '../common/logging';
import { User } from '../interface/user.types';
import { User as UserModel } from '../models/user';

const saveUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, userType }: User = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw new Error('Email in use');
    }

    const user = UserModel.build({ name, email, userType });

    logger.log(`User saved: ${email}`);

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User saved successfully',
    });
  } catch (error) {
    logger.error('Error saving user:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving user',
      error: process.env.NODE_ENV === 'production' ? undefined : error,
    });
  }
};

export { saveUser };
