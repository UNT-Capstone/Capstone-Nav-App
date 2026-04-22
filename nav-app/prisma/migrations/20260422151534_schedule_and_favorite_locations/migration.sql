-- CreateTable
CREATE TABLE "class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "time" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_location_userId_idx" ON "favorite_location"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_location_userId_name_lat_lng_key" ON "favorite_location"("userId", "name", "lat", "lng");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_location" ADD CONSTRAINT "favorite_location_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
