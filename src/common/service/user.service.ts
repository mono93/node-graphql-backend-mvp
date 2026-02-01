import { User, UserType } from '../../interface/user.types';
import { User as UserModel } from '../../models/user';
import mongoose from 'mongoose';

class UserService {
  async create(userData: {
    name: string;
    email: string;
    userType: UserType;
    auth0Id: string;
    userId: string;
  }): Promise<User> {
    const { name, email, userType, auth0Id, userId } = userData;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email in use');
    }

    let createdBy = new mongoose.Types.ObjectId(userId);
    let updatedBy = new mongoose.Types.ObjectId(userId);

    const user = UserModel.build({ name, email, userType, auth0Id, createdBy, updatedBy });
    await user.save();

    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const dataToUpdate: any = { ...updateData };
    dataToUpdate.updatedDate = new Date();
    if (dataToUpdate.updatedBy) {
      dataToUpdate.updatedBy = new mongoose.Types.ObjectId(dataToUpdate.updatedBy);
    }
    const user = await UserModel.findByIdAndUpdate(id, dataToUpdate, { new: true });
    return user;
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async getById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id).populate('incidents');
    return user;
  }

  async getByAuth0Id(auth0Id: string): Promise<User | null> {
    const user = await UserModel.findOne({ auth0Id }).populate('incidents');
    return user;
  }

  async getAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await UserModel.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdDate: -1 })
      .populate('incidents');
    return users;
  }

  async isOwner(userId: string, targetUserId: string): Promise<boolean> {
    return userId === targetUserId;
  }
}

// ✅ Singleton instance
const userService = new UserService();

export default userService;

// ✅ Export the instance type for TS
export type UserServiceType = InstanceType<typeof UserService>;
