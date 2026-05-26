-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Seed an owner for existing application rows. prisma/seed.ts updates this
-- account with the configured password hash during local setup.
INSERT INTO "User" ("id", "username", "passwordHash", "fullName", "createdAt", "updatedAt")
VALUES ('local-user', 'it', 'pending-seed-password', 'IT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("username") DO NOTHING;

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "userId" TEXT;

UPDATE "Application"
SET "userId" = COALESCE(
    (SELECT "id" FROM "User" WHERE "username" = 'it' LIMIT 1),
    'local-user'
)
WHERE "userId" IS NULL;

ALTER TABLE "Application" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
