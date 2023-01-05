-- MySQL Workbench Synchronization
-- Generated: 2023-01-05 11:01
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: Jakkapan

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER TABLE `chat`.`users` 
CHANGE COLUMN `status` `status` TINYINT(4) NOT NULL DEFAULT 0 ;

CREATE TABLE IF NOT EXISTS `chat`.`session` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `chanel_id` INT(11) NOT NULL,
  `users_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`, `chanel_id`, `users_id`),
  INDEX `fk_session_chanel_idx` (`chanel_id` ASC) VISIBLE,
  INDEX `fk_session_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_session_chanel`
    FOREIGN KEY (`chanel_id`)
    REFERENCES `chat`.`chanel` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_session_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `chat`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `chat`.`chanel` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;

CREATE TABLE IF NOT EXISTS `chat`.`message` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `msg` TEXT NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `session_id` INT(11) NOT NULL,
  `session_users_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_message_session1_idx` (`session_id` ASC, `session_users_id` ASC) VISIBLE,
  CONSTRAINT `fk_message_session1`
    FOREIGN KEY (`session_id` , `session_users_id`)
    REFERENCES `chat`.`session` (`id` , `users_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
