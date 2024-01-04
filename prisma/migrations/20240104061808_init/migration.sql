-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('APP', 'GOOGLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dob" TIMESTAMP(3),
    "profileImage" TEXT,
    "profileImageId" TEXT,
    "authenticationPlatform" "Platform" NOT NULL DEFAULT 'APP',
    "verificationCode" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verified" TIMESTAMP(3),
    "passwordCode" TEXT,
    "passwordCodeExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_email_idx" ON "User"("name", "email");
