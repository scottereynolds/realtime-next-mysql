-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('user', 'administrator') NOT NULL DEFAULT 'user';
