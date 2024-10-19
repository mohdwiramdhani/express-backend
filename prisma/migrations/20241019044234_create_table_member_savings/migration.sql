-- CreateTable
CREATE TABLE `member_savings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `principal` DOUBLE NULL DEFAULT 0,
    `mandatory` DOUBLE NULL DEFAULT 0,
    `voluntary` DOUBLE NULL DEFAULT 0,
    `memberProfileId` INTEGER NOT NULL,
    `workUnitId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `member_savings_memberProfileId_year_month_idx`(`memberProfileId`, `year`, `month`),
    UNIQUE INDEX `member_savings_year_month_memberProfileId_key`(`year`, `month`, `memberProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `member_savings` ADD CONSTRAINT `member_savings_memberProfileId_fkey` FOREIGN KEY (`memberProfileId`) REFERENCES `member_profiles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_savings` ADD CONSTRAINT `member_savings_workUnitId_fkey` FOREIGN KEY (`workUnitId`) REFERENCES `work_units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
