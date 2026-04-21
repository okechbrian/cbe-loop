-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" DATETIME,
    CONSTRAINT "Payout_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payout_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "WasteBatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payout" ("amount", "batchId", "createdAt", "currency", "id", "paidAt", "providerRef", "status", "supplierId") SELECT "amount", "batchId", "createdAt", "currency", "id", "paidAt", "providerRef", "status", "supplierId" FROM "Payout";
DROP TABLE "Payout";
ALTER TABLE "new_Payout" RENAME TO "Payout";
CREATE UNIQUE INDEX "Payout_batchId_key" ON "Payout"("batchId");
CREATE TABLE "new_RateCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "pricePerKg" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'UGX',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_RateCard" ("active", "category", "createdAt", "currency", "id", "pricePerKg") SELECT "active", "category", "createdAt", "currency", "id", "pricePerKg" FROM "RateCard";
DROP TABLE "RateCard";
ALTER TABLE "new_RateCard" RENAME TO "RateCard";
CREATE INDEX "RateCard_category_active_idx" ON "RateCard"("category", "active");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
