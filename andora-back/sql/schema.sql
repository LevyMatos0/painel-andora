-- Estrutura inicial. Sem DROP, USE, credenciais ou dados pessoais.
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `tb_user` (
  `usr_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usr_email` VARCHAR(225) NOT NULL,
  `usr_senha` VARCHAR(255) NOT NULL,
  `usr_telefone` VARCHAR(25) DEFAULT NULL,
  `usr_cargo` VARCHAR(30) NOT NULL,
  `usr_cargo_ingles` VARCHAR(30) DEFAULT NULL,
  `usr_nome` VARCHAR(225) NOT NULL,
  `usr_foto` VARCHAR(255) DEFAULT NULL,
  `usr_bio` TEXT NULL,
  `usr_bio_ingles` TEXT NULL,
  `usr_data_atualizacao` TIMESTAMP NOT NULL
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usr_codigo`),
  CONSTRAINT `uq_user_email` UNIQUE (`usr_email`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_hero` (
  `her_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `her_titulo` VARCHAR(150) NOT NULL,
  `her_titulo_ingles` VARCHAR(150) DEFAULT NULL,
  `her_descricao` TEXT NOT NULL,
  `her_descricao_ingles` TEXT DEFAULT NULL,
  `her_imagem` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`her_codigo`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_about` (
  `abt_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `abt_titulo` VARCHAR(125) NOT NULL,
  `abt_titulo_ingles` VARCHAR(125) DEFAULT NULL,
  `abt_imagem` VARCHAR(255) NOT NULL,
  `abt_texto` TEXT NOT NULL,
  `abt_texto_ingles` TEXT DEFAULT NULL,
  PRIMARY KEY (`abt_codigo`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_contato` (
  `cto_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `cto_endereco` VARCHAR(100) NOT NULL,
  `cto_telefone` VARCHAR(25) NOT NULL,
  `cto_email` VARCHAR(100) NOT NULL,
  `cto_mapa` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`cto_codigo`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_servico` (
  `srv_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `srv_titulo` VARCHAR(100) NOT NULL,
  `srv_titulo_ingles` VARCHAR(100) DEFAULT NULL,
  `srv_descricao` TEXT NOT NULL,
  `srv_descricao_ingles` TEXT DEFAULT NULL,
  `srv_informacoes` TEXT NOT NULL,
  `srv_informacoes_ingles` TEXT DEFAULT NULL,
  `srv_icone` VARCHAR(255) NOT NULL,
  `srv_ordem` INT UNSIGNED NOT NULL DEFAULT 0,
  `srv_ativo` TINYINT(1) NOT NULL DEFAULT 1,
  `srv_criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `srv_atualizado_em` TIMESTAMP NOT NULL
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`srv_codigo`),
  KEY `idx_servico_ordem_ativo` (`srv_ativo`, `srv_ordem`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_team` (
  `tms_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tms_nome` VARCHAR(225) NOT NULL,
  `tms_cargo` VARCHAR(45) NOT NULL,
  `tms_cargo_ingles` VARCHAR(45) DEFAULT NULL,
  `tms_apresentacao` TEXT NOT NULL,
  `tms_apresentacao_ingles` TEXT DEFAULT NULL,
  `tms_linkedin` VARCHAR(255) DEFAULT NULL,
  `tms_github` VARCHAR(255) DEFAULT NULL,
  `tms_imagem` VARCHAR(255) NOT NULL,
  `tms_ordem` INT UNSIGNED NOT NULL DEFAULT 0,
  `tms_status` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`tms_codigo`),
  KEY `idx_team_ordem_status` (`tms_status`, `tms_ordem`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_faq` (
  `faq_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `faq_pergunta` VARCHAR(255) NOT NULL,
  `faq_pergunta_ingles` VARCHAR(255) DEFAULT NULL,
  `faq_resposta` TEXT NOT NULL,
  `faq_resposta_ingles` TEXT DEFAULT NULL,
  `faq_ordem` INT UNSIGNED NOT NULL DEFAULT 0,
  `faq_status` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`faq_codigo`),
  KEY `idx_faq_ordem_status` (`faq_status`, `faq_ordem`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tb_mensagem` (
  `msg_codigo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `msg_nome` VARCHAR(100) NOT NULL,
  `msg_email` VARCHAR(255) NOT NULL,
  `msg_telefone` VARCHAR(25) DEFAULT NULL,
  `msg_assunto` VARCHAR(150) NOT NULL,
  `msg_conteudo` TEXT NOT NULL,
  `msg_status` ENUM('nova', 'lida', 'respondida') NOT NULL DEFAULT 'nova',
  `msg_criado` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`msg_codigo`),
  KEY `idx_mensagem_status_data` (`msg_status`, `msg_criado`)
) ENGINE=InnoDB
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
