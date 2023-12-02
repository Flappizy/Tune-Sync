import { PrismaClient, Prisma, User, AuthProvider } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await prisma.user.create({
    data: {
      userName: input.userName,
      email: input.email,
      authProvider: input.authProvider,
      emailVerificationToken: input.emailVerificationToken,
      passwordHash: input.passwordHash      
    }
  })) as User;
};

export const createOrUpdateExternalAuthUser = async (input: Prisma.UserCreateInput) => {
    return (await prisma.user.upsert({
      where: { email: input.email },
      create: {
        created: new Date(),
        userName: input.userName,
        email: input.email,
        emailConfirmed: new Date(),
        authProvider: input.authProvider,
      },
      update: { 
        userName: input.userName, 
        email: input.email 
      },
    })) as User;
}

export const findUniqueUser = async (
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect
  ) => {
    return (await prisma.user.findUnique({
      where,
      select,
    })) as User;
  };

export const verifyUserAccount = async (userId: number, emailConfirmed: Date) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: null,
      emailConfirmed: emailConfirmed
    },
  }); 
}

export const updateUserVerificationToken = async (token: string) => {
  await prisma.user.update({
    where: { emailVerificationToken: token },
    data: {
      emailVerificationToken: token,
    },
  }); 
}

export const updateUserPasswordToken = async (id: number, token: string) => {
  await prisma.user.update({
    where: { id: id },
    data: {
      passwordResetToken: token,
    },
  }); 
}

export const updateRefreshToken = async (id: number, token: string, date: Date) => {
  await prisma.user.update({
    where: { id: id },
    data: {
      refreshTokenExpires: date,
      refreshToken: token
    },
  }); 
}


export const resetUserPassword = async (token: string, hashedPassword: string) => {
  await prisma.user.update({
    where: { passwordResetToken: token },
    data: {
      passwordResetToken: null,
      passwordHash: hashedPassword
    },
  }); 
}
