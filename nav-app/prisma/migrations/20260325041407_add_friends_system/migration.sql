-- CreateTable
CREATE TABLE "friend" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "friend_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friend_receiverId_status_idx" ON "friend"("receiverId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "friend_senderId_receiverId_key" ON "friend"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
