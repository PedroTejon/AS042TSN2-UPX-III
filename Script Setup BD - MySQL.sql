CREATE DATABASE UPXIII;
USE UPXIII;

CREATE TABLE IF NOT EXISTS plataformas (
  id_plataforma INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  url VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_plataforma)
);

CREATE TABLE  IF NOT EXISTS anuncios (
  id_anuncio INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  avaliacao DECIMAL(4,2) NULL,
  preco FLOAT NOT NULL,
  descricao MEDIUMTEXT NULL,
  URL VARCHAR(200) NOT NULL,
  foto VARCHAR(300) NOT NULL,
  id_plataforma INT NOT NULL,
  PRIMARY KEY (id_anuncio),
  FOREIGN KEY (id_plataforma) REFERENCES plataformas (id_plataforma)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(75) NOT NULL UNIQUE,
  senha_hash VARCHAR(200) NOT NULL,
  nome VARCHAR(45) NOT NULL,
  data_nasc DATE NOT NULL,
  genero VARCHAR(45) NULL,
  PRIMARY KEY (id_usuario)
);

CREATE TABLE IF NOT EXISTS anuncios_salvos (
  id_usuario INT NOT NULL,
  id_anuncio_salvo INT NOT NULL,
  PRIMARY KEY (id_usuario, id_anuncio_salvo),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  FOREIGN KEY (id_anuncio_salvo) REFERENCES anuncios (id_anuncio)
);

CREATE TABLE IF NOT EXISTS anuncios_escondidos (
  id_usuario INT NOT NULL,
  id_anuncio INT NOT NULL,
  PRIMARY KEY (id_usuario, id_anuncio),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
  FOREIGN KEY (id_anuncio) REFERENCES anuncios (id_anuncio)
);

CREATE TABLE IF NOT EXISTS sessoes_usuario (
  sess_hash VARCHAR(32) NOT NULL,
  id_usuario INT NOT NULL,
  login_date DATETIME NOT NULL,
  expires DATETIME NOT NULL,
  PRIMARY KEY (sess_hash),
  FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

INSERT INTO plataformas VALUES (null, 'EnergiaTotal', 'https://www.energiatotal.com.br');
INSERT INTO plataformas VALUES (null, 'Leroy Merlin', 'https://www.leroymerlin.com.br/');
INSERT INTO plataformas VALUES (null, 'Magazine Luiza', 'https://www.magazineluiza.com.br/');
INSERT INTO plataformas VALUES (null, 'Mercado Livre', 'https://www.mercadolivre.com.br/');
INSERT INTO plataformas VALUES (null, 'Minha Casa Solar', 'https://www.minhacasasolar.com.br/');
INSERT INTO plataformas VALUES (null, 'NeoSolar', 'https://www.neosolar.com.br/loja');

DELIMITER $$
CREATE PROCEDURE insert_anun(titulo VARCHAR(150), avaliacao DECIMAL(4,2), preco FLOAT, descricao TEXT, URL VARCHAR(200), foto VARCHAR(300), plat INT)
BEGIN
  INSERT INTO anuncios VALUES (default, titulo, avaliacao, preco, descricao, URL, foto, plat);
END$$

CREATE PROCEDURE insert_user(email VARCHAR(75), senha_hash VARCHAR(200), nome VARCHAR(45), data_nasc DATE, genero VARCHAR(45))
BEGIN
  INSERT INTO usuarios VALUES (default, email, senha_hash, nome, data_nasc, genero);
END$$

CREATE PROCEDURE hide_anun(id_usuario INT, id_anuncio INT)
BEGIN
  INSERT INTO anuncios_escondidos VALUES (id_usuario, id_anuncio);
END$$

CREATE PROCEDURE unhide_anun(id_usuario INT, id_anuncio INT)
BEGIN
  DELETE FROM anuncios_escondidos WHERE anuncios_escondidos.id_anuncio = id_anuncio AND anuncios_escondidos.id_usuario = id_usuario;
END$$

CREATE PROCEDURE save_anun(id_usuario INT, id_anuncio INT)
BEGIN
  INSERT INTO anuncios_salvos VALUES (id_usuario, id_anuncio);
END$$

CREATE PROCEDURE unsave_anun(id_usuario INT, id_anuncio INT)
BEGIN
  DELETE FROM anuncios_salvos WHERE anuncios_salvos.id_anuncio = id_anuncio AND anuncios_salvos.id_usuario = id_usuario;
END$$

DELIMITER ;