USE UPXIII;

CREATE TABLE IF NOT EXISTS plataformas (
  id_plataforma INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  url VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_plataforma)
);

CREATE TABLE IF NOT EXISTS anuncios (
  id_anuncio INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  avaliacao DECIMAL(4,2) NULL,
  preco FLOAT NOT NULL,
  URL VARCHAR(200) NOT NULL,
  foto BLOB NOT NULL,
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

DELIMITER $$
DROP PROCEDURE IF EXISTS insert_plat;
CREATE PROCEDURE insert_plat(nome VARCHAR(100), URL VARCHAR(100))
BEGIN
  INSERT INTO plataformas VALUES (nome, URL);
END$$

DROP PROCEDURE IF EXISTS insert_anun;
CREATE PROCEDURE insert_anun(titulo VARCHAR(150), avaliacao DECIMAL(4,2), preco FLOAT, URL VARCHAR(200), foto BLOB)
BEGIN
  INSERT INTO anuncios VALUES (titulo, avaliacao, preco, URL, foto);
END$$

DROP PROCEDURE IF EXISTS insert_user;
CREATE PROCEDURE insert_user(email VARCHAR(75), senha_hash VARCHAR(200), nome VARCHAR(45), data_nasc DATE, genero VARCHAR(45))
BEGIN
  INSERT INTO usuarios VALUES (email, senha_hash, nome, data_nasc, genero);
END$$

DROP PROCEDURE IF EXISTS hide_anun;
CREATE PROCEDURE hide_anun(id_usuario INT, id_anuncio INT)
BEGIN
  INSERT INTO anuncios_escondidos VALUES (id_usuario, id_anuncio);
END$$

DROP PROCEDURE IF EXISTS save_anun;
CREATE PROCEDURE save_anun(id_usuario INT, id_anuncio INT)
BEGIN
  INSERT INTO anuncios_salvos VALUES (id_usuario, id_anuncio);
END$$

DROP PROCEDURE IF EXISTS query_page;
CREATE PROCEDURE query_page(index_i INT) 
BEGIN
  SELECT * FROM anuncios 
  LEFT JOIN anuncios_escondidos ON anuncios.id_anuncio = anuncios_escondidos.id_anuncio
  WHERE anuncios_escondidos.id_anuncio = NULL 
  LIMIT index_i OFFSET 50;
END$$

DELIMITER ;