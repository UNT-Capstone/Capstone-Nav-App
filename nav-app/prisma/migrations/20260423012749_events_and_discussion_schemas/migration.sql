-- CreateTable
CREATE TABLE "community_event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL DEFAULT 33.2108,
    "lng" DOUBLE PRECISION NOT NULL DEFAULT -97.1459,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_tag" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "event_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_comment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "community_event_createdById_idx" ON "community_event"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "event_tag_eventId_userId_key" ON "event_tag"("eventId", "userId");

-- CreateIndex
CREATE INDEX "event_comment_eventId_createdAt_idx" ON "event_comment"("eventId", "createdAt");

-- AddForeignKey
ALTER TABLE "community_event" ADD CONSTRAINT "community_event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "community_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tag" ADD CONSTRAINT "event_tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comment" ADD CONSTRAINT "event_comment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "community_event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comment" ADD CONSTRAINT "event_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comment" ADD CONSTRAINT "event_comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "event_comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
