/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejoinDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "leaveDate" DATETIME
);
