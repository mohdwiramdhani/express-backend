-- CreateTable
CREATE TABLE `profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(255) NULL,
    `nik` VARCHAR(16) NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `profiles_nik_key`(`nik`),
    UNIQUE INDEX `profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
