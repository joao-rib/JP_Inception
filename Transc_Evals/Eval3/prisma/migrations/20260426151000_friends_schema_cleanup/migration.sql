-- Cleanup migration to align DB with schema after friendship/presence changes.
DROP INDEX IF EXISTS "Friendship_userAId_idx";
ALTER TABLE "Account" DROP COLUMN IF EXISTS "lastSeenAt";
