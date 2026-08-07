import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import type { User, Profile } from '@/types';

export class UserService {
  async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        profile: {
          create: {},
        },
      },
    });

    return user as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user as User | null;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user as User | null;
  }

  async verifyUserPassword(
    email: string,
    password: string
  ): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) return false;
    return verifyPassword(password, user.password);
  }

  async updateUserProfile(
    userId: string,
    data: Partial<Profile>
  ): Promise<Profile> {
    const profile = await db.profile.update({
      where: { userId },
      data,
    });
    return profile as Profile;
  }

  async getUserProfile(userId: string): Promise<Profile | null> {
    const profile = await db.profile.findUnique({
      where: { userId },
    });
    return profile as Profile | null;
  }
}

export const userService = new UserService();
