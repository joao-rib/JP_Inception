-- Keep only chess rows before removing the multi-game column
DELETE FROM "Score"
WHERE "game" <> 'chess';

-- Replace per-game uniqueness with one score row per account
DROP INDEX IF EXISTS "Score_accountId_game_key";
ALTER TABLE "Score" DROP COLUMN "game";
CREATE UNIQUE INDEX "Score_accountId_key" ON "Score"("accountId");

-- Enum is no longer used by any table
DROP TYPE IF EXISTS "Game";
