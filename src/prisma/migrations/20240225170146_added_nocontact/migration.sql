-- CreateTable
CREATE TABLE "NoContactRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "blockerId" INTEGER NOT NULL,
    "blockedId" INTEGER NOT NULL,
    CONSTRAINT "NoContactRelation_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NoContactRelation_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "Member" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NoContactRelation_blockerId_blockedId_key" ON "NoContactRelation"("blockerId", "blockedId");
