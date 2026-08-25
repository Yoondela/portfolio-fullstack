ALTER TABLE "Screenshot" ADD COLUMN "legacyUrl" TEXT;

ALTER TABLE "Screenshot" ALTER COLUMN "storagePath" DROP NOT NULL;

UPDATE "Screenshot"
SET
  "legacyUrl" = "storagePath",
  "storagePath" = NULL
WHERE "storagePath" ~* '^https?://';

CREATE UNIQUE INDEX "Screenshot_storagePath_key" ON "Screenshot"("storagePath");
