-- CreateTable
CREATE TABLE "Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message_id" TEXT NOT NULL,
    "daytime" TEXT NOT NULL,
    "nighttime" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
