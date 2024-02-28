-- CreateTable
CREATE TABLE "CourtRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "courtRoomId" INTEGER NOT NULL,
    CONSTRAINT "Channel_courtRoomId_fkey" FOREIGN KEY ("courtRoomId") REFERENCES "CourtRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "courtRoomId" INTEGER NOT NULL,
    CONSTRAINT "Role_courtRoomId_fkey" FOREIGN KEY ("courtRoomId") REFERENCES "CourtRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CourtRoom_categoryId_key" ON "CourtRoom"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_channelId_key" ON "Channel"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_roleId_key" ON "Role"("roleId");
