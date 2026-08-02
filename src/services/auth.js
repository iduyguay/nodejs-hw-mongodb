import User from '../models/user.js';
import Session from '../models/session.js';
import createHttpError from 'http-errors';
import { generateTokens, verifyToken } from '../utils/token.js';

const register = async (userData) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const user = await User.create(userData);

  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil } = generateTokens(user._id);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const { userId } = verifyToken(refreshToken);

  const user = await User.findById(userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const existingSession = await Session.findOne({ userId, refreshToken });
  if (!existingSession) {
    throw createHttpError(401, 'Invalid refresh token');
  }
  await Session.deleteOne({ _id: existingSession._id });

  const { accessToken, refreshToken: newRefreshToken, accessTokenValidUntil, refreshTokenValidUntil } = generateTokens(userId);

  await Session.create({
    userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not provided');
  }

  const { userId } = verifyToken(refreshToken);

  const result = await Session.deleteOne({ userId, refreshToken });
  if (result.deletedCount === 0) {
    throw createHttpError(401, 'Invalid refresh token');
  }
};

export const authService = {
  register,
  login,
  refresh,
  logout,
};