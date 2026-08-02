import User from '../models/user.js';
import Session from '../models/session.js';
import createHttpError from 'http-errors';
import { generateTokens, verifyToken } from '../utils/token.js';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { sendMail } from '../utils/sendMail.js';

const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

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

const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-mail.html');
  const templateContent = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateContent.toString());

  const htmlContent = template({
    name: user.name,
    url: `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`,
    token: resetToken,
    DOMAIN: process.env.APP_DOMAIN,
    year: new Date().getFullYear(),
  });

  try {
    await sendMail({
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: 'Password Reset',
      html: htmlContent,
    });
  } catch {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

  return {
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  };
};

const resetPassword = async (token, newPassword) => {
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const userId = decodedToken.sub;
  const userEmail = decodedToken.email;

  const user = await User.findOne({
    _id: userId,
    email: userEmail,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  user.password = newPassword;
  await user.save();

  await Session.deleteMany({ userId });

  return {
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  };
};

export const authService = {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
};