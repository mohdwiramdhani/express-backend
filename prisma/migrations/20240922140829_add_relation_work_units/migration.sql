/*
  Warnings:

  - You are about to drop the column `workUnit` on the `member_profiles` table. All the data in the column will be lost.
  - Added the required column `workUnitId` to the `member_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `member_profiles` DROP COLUMN `workUnit`,
    ADD COLUMN `workUnitId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `member_profiles` ADD CONSTRAINT `member_profiles_workUnitId_fkey` FOREIGN KEY (`workUnitId`) REFERENCES `work_units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
