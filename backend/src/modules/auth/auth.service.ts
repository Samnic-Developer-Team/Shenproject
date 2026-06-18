import bcrypt from 'bcryptjs';
import { ApiError } from '../../utils/ApiError';
import { generateToken } from '../../utils/generateToken';
import { AuthUserModel } from './auth.model';
import type { AuthTokens, LoginPayload, RegisterPayload } from './auth.interface';
import { Roles } from '../../constants/roles';

const sanitizeUser = (user: { _id: unknown; name: string; email: string; role: string }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const authService = {
  async register(payload: RegisterPayload) {
    const existingUser = await AuthUserModel.findOne({ email: payload.email }).lean();

    if (existingUser) {
      throw new ApiError(409, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const createdUser = await AuthUserModel.create({
      ...payload,
      password: hashedPassword,
      role: payload.role ?? Roles.USER,
    });

    const accessToken = generateToken({
      userId: String(createdUser._id),
      role: createdUser.role,
      email: createdUser.email,
    });

    return {
      user: sanitizeUser(createdUser),
      tokens: { accessToken } satisfies AuthTokens,
    };
  },

  async login(payload: LoginPayload) {
    const user = await AuthUserModel.findOne({ email: payload.email }).select('+password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = generateToken({
      userId: String(user._id),
      role: user.role,
      email: user.email,
    });

    return {
      user: sanitizeUser(user),
      tokens: { accessToken } satisfies AuthTokens,
    };
  },

  async findById(id: string) {
    const user = await AuthUserModel.findById(id).lean();
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};
