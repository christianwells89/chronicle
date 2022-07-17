import crypto from 'crypto';

import { User } from '@prisma/client';

import { prisma } from 'lib/client';

export interface UserDTO {
  id: string;
  username: string;
}

export function getUserByUsername(username: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { username } });
}

export function validatePassword(user: User, inputPassword: string): boolean {
  const inputHash = hashPassword(inputPassword, user.salt);
  return user.hash === inputHash;
}

export function createUser(username: string, password: string): Promise<User> {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(password, salt);

  return prisma.user.create({ data: { username, hash, salt } });
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}
