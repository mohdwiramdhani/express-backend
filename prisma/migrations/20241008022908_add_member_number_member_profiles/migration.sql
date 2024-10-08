/*
  Warnings:

  - A unique constraint covering the columns `[memberNumber]` on the table `member_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `member_profiles_memberNumber_key` ON `member_profiles`(`memberNumber`);
