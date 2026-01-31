import { User } from '../../interface/user.types';
import { User as UserModel } from '../../models/user';

class UserService {
  async create(userData: Omit<User, 'id'>): Promise<User> {
    const { name, email, userType, auth0Id }: User = userData;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email in use');
    }

    const user = UserModel.build({ name, email, userType, auth0Id });
    await user.save();

    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
    return user;
  }

  async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async getById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user;
  }

  async getAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    const users = await UserModel.find().skip(skip).limit(limit).sort({ createdDate: -1 });
    return users;
  }
}

// ✅ Singleton instance
const userService = new UserService();

export default userService;

// ✅ Export the instance type for TS
export type UserServiceType = InstanceType<typeof UserService>;
