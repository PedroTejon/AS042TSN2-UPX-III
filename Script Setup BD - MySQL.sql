CREATE DATABASE UPXIII;
USE UPXIII;

CREATE TABLE IF NOT EXISTS plataformas (
  id_plataforma INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  url VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_plataforma)
);

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  PRIMARY KEY (id_categoria)
);

CREATE TABLE IF NOT EXISTS anuncios (
  id_anuncio INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  avaliacao DECIMAL(4,2) NULL,
  qntd_avaliacoes INT NULL,
  preco FLOAT NOT NULL,
  descricao LONGTEXT NULL,
  URL VARCHAR(200) NOT NULL,
  foto VARCHAR(300) NOT NULL,
  id_plataforma INT NOT NULL,
  oculto TINYINT NOT NULL,
  id_categoria INT NOT NULL,
  PRIMARY KEY (id_anuncio),
  FOREIGN KEY (id_plataforma) REFERENCES plataformas (id_plataforma),
  FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(75) NOT NULL UNIQUE,
  senha_hash VARCHAR(200) NOT NULL,
  nome VARCHAR(45) NOT NULL,
  data_nasc DATE NOT NULL,
  genero VARCHAR(45) NULL,
  administrador TINYINT NULL,
  PRIMARY KEY (id_usuario)
);

CREATE TABLE IF NOT EXISTS anuncios_salvos (
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

INSERT INTO plataformas VALUES 
(default, 'EnergiaTotal', 'https://www.energiatotal.com.br'),
(default, 'Leroy Merlin', 'https://www.leroymerlin.com.br/'),
(default, 'Magazine Luiza', 'https://www.magazineluiza.com.br/'),
(default, 'Mercado Livre', 'https://www.mercadolivre.com.br/'),
(default, 'Minha Casa Solar', 'https://www.minhacasasolar.com.br/'),
(default, 'NeoSolar', 'https://www.neosolar.com.br/loja');

INSERT INTO categorias VALUES 
(default, 'Painéis Solares'),
(default, 'Estruturação'),
(default, 'Controladores de Carga'),
(default, 'Inversores Solares'),
(default, 'Ferramentas'),
(default, 'Baterias'),
(default, 'Kits Solares'),
(default, 'Cabos'),
(default, 'Disjuntores'),
(default, 'Proteções de Rede'),
(default, 'Iluminação'),
(default, 'Aquecimento'),
(default, 'Carro Elétrico'),
(default, 'Outros'),
(default, 'Bombeamento Solar');

DELIMITER $$
CREATE PROCEDURE insert_anun(titulo VARCHAR(150), avaliacao DECIMAL(4,2), preco FLOAT, descricao TEXT, URL VARCHAR(200), foto VARCHAR(300), plat INT, categoria_id INT, qntd_avaliacoes INT)
BEGIN
  INSERT INTO anuncios VALUES (default, titulo, avaliacao, qntd_avaliacoes, preco, descricao, URL, foto, plat, 0, categoria_id);
END$$

CREATE PROCEDURE insert_user(email VARCHAR(75), senha_hash VARCHAR(200), nome VARCHAR(45), data_nasc DATE, genero VARCHAR(45))
BEGIN
  INSERT INTO usuarios VALUES (default, email, senha_hash, nome, data_nasc, genero, 0);
END$$

CREATE PROCEDURE hide_anun(id_usuario INT, id_anuncio INT)
BEGIN
  SET @isAdm = 0;
  SET @isHidden = 0;
  SELECT administrador, oculto INTO @isAdm, @isHidden FROM usuarios JOIN anuncios on id_anuncio = anuncios.id_anuncio;
  IF @isAdm = 1 AND @isHidden = 0 THEN
    UPDATE anuncios SET oculto = 1 WHERE anuncios.id_anuncio = id_anuncio;
    SELECT 1 AS code;
  ELSE
	  SELECT 0 AS code;
  END IF;
END$$

CREATE PROCEDURE unhide_anun(id_usuario INT, id_anuncio INT)
BEGIN
  SET @isAdm = 0;
  SET @isHidden = 0;
  SELECT administrador, oculto INTO @isAdm, @isHidden FROM usuarios JOIN anuncios on id_anuncio = anuncios.id_anuncio;
  IF @isAdm = 1 AND @isHidden = 1 THEN
    UPDATE anuncios SET oculto = 0 WHERE anuncios.id_anuncio = id_anuncio;
    SELECT 1 AS code;
  ELSE
	  SELECT 0 AS code;
  END IF;
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