-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "guildName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejoinDate" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "leaveDate" DATETIME,
    "karmaPoints" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Member" ("active", "discordId", "guildName", "id", "joinDate", "leaveDate", "rejoinDate", "username") SELECT "active", "discordId", "guildName", "id", "joinDate", "leaveDate", "rejoinDate", "username" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE UNIQUE INDEX "Member_discordId_key" ON "Member"("discordId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
