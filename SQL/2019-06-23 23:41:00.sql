ALTER TABLE "Users" ADD COLUMN "TokenGenerated" TIMESTAMP;
UPDATE "Users" SET "TokenGenerated" = NOW();