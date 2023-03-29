/*
  Warnings:

  - You are about to drop the column `message_id` on the `Games` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT,
    "daytime" TEXT NOT NULL,
    "nighttime" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_Games" ("daytime", "id", "nighttime", "role") SELECT "daytime", "id", "nighttime", "role" FROM "Games";
DROP TABLE "Games";
ALTER TABLE "new_Games" RENAME TO "Games";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
