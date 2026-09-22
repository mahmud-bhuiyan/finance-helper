import type { Prisma } from '@prisma/client';

export type AuthUser = Prisma.UserGetPayload<{
  include: {
    role: {
      include: {
        permissions: { include: { module: true } };
      };
    };
  };
}>;

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
