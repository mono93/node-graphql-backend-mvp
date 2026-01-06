import { User } from '../../interface/user.types';
import { User as UserModel } from '../../models/user';

class UserService {
  async saveUser(userData: Omit<User, 'id'>): Promise<User> {
    const { name, email, userType }: User = userData;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('Email in use');
    }

    const user = UserModel.build({ name, email, userType });
    await user.save();

    return user;
  }

  async getById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user;
  }
}

// ✅ Singleton instance
const userService = new UserService();

export default userService;

// ✅ Export the instance type for TS
export type UserServiceType = InstanceType<typeof UserService>;
