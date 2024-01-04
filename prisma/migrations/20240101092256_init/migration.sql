-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('Email', 'Google');

-- CreateEnum
CREATE TYPE "StreamingPlatform" AS ENUM ('Spotify', 'Deezer');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "passwordSalt" TEXT,
    "passwordResetToken" TEXT,
    "emailVerificationToken" TEXT,
    "refreshToken" TEXT,
    "authProvider" "AuthProvider" NOT NULL,
    "passwordResetStamp" TIMESTAMP(3) DEFAULT '1970-01-01 00:00:00 +00:00',
    "emailConfirmed" TIMESTAMP(3) DEFAULT '1970-01-01 00:00:00 +00:00',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "refreshTokenExpires" TIMESTAMP(3) DEFAULT '1970-01-01 00:00:00 +00:00',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConnectedStreamingPlatforms" (
    "id" SERIAL NOT NULL,
    "streamingPlatform" "StreamingPlatform" NOT NULL,
    "streamingPlatformUserId" TEXT,
    "streamingPlatformRefreshToken" TEXT,
    "userId" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserConnectedStreamingPlatforms_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_userName_key" ON "Users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_passwordResetToken_key" ON "Users"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Users_emailVerificationToken_key" ON "Users"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Users_refreshToken_key" ON "Users"("refreshToken");

-- AddForeignKey
ALTER TABLE "UserConnectedStreamingPlatforms" ADD CONSTRAINT "UserConnectedStreamingPlatforms_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
