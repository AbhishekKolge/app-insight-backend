-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('INR', 'DOLLAR');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('NEUTRAL', 'POSITIVE', 'NEGATIVE');

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "reviewCount" INTEGER NOT NULL,
    "size" DOUBLE PRECISION,
    "installCount" INTEGER NOT NULL,
    "type" "Type" NOT NULL DEFAULT 'FREE',
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "CurrencyType" NOT NULL DEFAULT 'DOLLAR',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentVersion" TEXT,
    "androidVersion" TEXT,
    "categoryId" TEXT,
    "contentRatingId" TEXT,
    "genreId" TEXT,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentRating" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ContentRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "comment" TEXT,
    "appId" TEXT NOT NULL,
    "sentiment" "Sentiment",

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "App_name_key" ON "App"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentRating_name_key" ON "ContentRating"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_contentRatingId_fkey" FOREIGN KEY ("contentRatingId") REFERENCES "ContentRating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App"("id") ON DELETE CASCADE ON UPDATE CASCADE;
