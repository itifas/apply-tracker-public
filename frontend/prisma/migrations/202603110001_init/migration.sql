-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('Pending', 'Passed', 'Rejected');

-- CreateEnum
CREATE TYPE "FinalStatus" AS ENUM ('Applied', 'Interviewing', 'Rejected', 'OFFER', 'Ghosted');

-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('FollowUp3Days', 'FollowUp7Days', 'FollowUp14Days', 'Ghosted30Days', 'Custom');

-- CreateEnum
CREATE TYPE "CalendarProvider" AS ENUM ('Google', 'Outlook', 'ICS');

-- CreateEnum
CREATE TYPE "EmailProvider" AS ENUM ('Gmail', 'Outlook');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "location" TEXT,
    "applicationLink" TEXT,
    "dateApplied" TIMESTAMP(3) NOT NULL,
    "contactPerson" TEXT,
    "contactInfo" TEXT,
    "salary" TEXT,
    "step1Status" "StepStatus" NOT NULL DEFAULT 'Pending',
    "step2Status" "StepStatus" NOT NULL DEFAULT 'Pending',
    "step3Status" "StepStatus" NOT NULL DEFAULT 'Pending',
    "finalStatus" "FinalStatus" NOT NULL DEFAULT 'Applied',
    "nextFollowUp" TIMESTAMP(3),
    "notes" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "reminderDate" TIMESTAMP(3) NOT NULL,
    "reminderType" "ReminderType" NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalendarConnection" (
    "id" TEXT NOT NULL,
    "provider" "CalendarProvider" NOT NULL,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalendarConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailConnection" (
    "id" TEXT NOT NULL,
    "provider" "EmailProvider" NOT NULL,
    "accountEmail" TEXT NOT NULL,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" TIMESTAMP(3),

    CONSTRAINT "EmailConnection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
