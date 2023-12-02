-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('Email');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "passwordSalt" TEXT,
    "passwordResetToken" TEXT,
    "emailVerificationToken" TEXT,
    "refreshToken" TEXT,
    "authProvider" "AuthProvider" NOT NULL,
    "passwordResetStamp" TIMESTAMP(3),
    "emailConfirmed" TIMESTAMP(3) NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshTokenExpires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
