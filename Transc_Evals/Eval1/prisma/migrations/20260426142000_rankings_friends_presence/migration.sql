-- Remove the old OAuth tables/types because they are not used anymore.
DROP TABLE IF EXISTS "OAuthAccount";
DROP TYPE IF EXISTS "OAuthProvider";

-- Presence tracking for accounts.
DO $$ BEGIN
    CREATE TYPE "OnlineStatus" AS ENUM ('ONLINE', 'OFFLINE');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Account"
    ADD COLUMN IF NOT EXISTS "onlineStatus" "OnlineStatus" NOT NULL DEFAULT 'OFFLINE',
    ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3);

-- Convert the chess-only score to the new leaderboard shape.
ALTER TABLE "Score" RENAME COLUMN "gamesPlayed" TO "rating";
ALTER TABLE "Score" RENAME COLUMN "gamesWon" TO "wins";
ALTER TABLE "Score" RENAME COLUMN "gamesLost" TO "losses";
ALTER TABLE "Score" ALTER COLUMN "rating" SET DEFAULT 0;
ALTER TABLE "Score" ALTER COLUMN "wins" SET DEFAULT 0;
ALTER TABLE "Score" ALTER COLUMN "losses" SET DEFAULT 0;

-- Symmetric friendship table.
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Friendship_userAId_userBId_key" ON "Friendship"("userAId", "userBId");
CREATE INDEX "Friendship_userAId_idx" ON "Friendship"("userAId");
CREATE INDEX "Friendship_userBId_idx" ON "Friendship"("userBId");

ALTER TABLE "Friendship"
    ADD CONSTRAINT "Friendship_userAId_fkey"
    FOREIGN KEY ("userAId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Friendship"
    ADD CONSTRAINT "Friendship_userBId_fkey"
    FOREIGN KEY ("userBId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
