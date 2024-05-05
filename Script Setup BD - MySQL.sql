CREATE DATABASE IF NOT EXISTS UPXIII;
USE UPXIII;

CREATE TABLE IF NOT EXISTS Platforms (
  platformId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  url VARCHAR(100) NOT NULL,
  PRIMARY KEY (platformId)
);

CREATE TABLE IF NOT EXISTS Categories (
  categoryId INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (categoryId)
);

CREATE TABLE IF NOT EXISTS Products (
  productId INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  rating DECIMAL(4,2) NULL,
  ratingAmount INT NULL,
  price FLOAT NOT NULL,
  description LONGTEXT NULL,
  url VARCHAR(500) NOT NULL,
  image VARCHAR(300) NOT NULL,
  hidden TINYINT NOT NULL,
  platformId INT NOT NULL,
  categoryId INT NOT NULL,
  PRIMARY KEY (productId),
  FOREIGN KEY (platformId) REFERENCES Platforms (platformId),
  FOREIGN KEY (categoryId) REFERENCES Categories (categoryId)
);

CREATE TABLE IF NOT EXISTS Users (
  userId INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(75) NOT NULL UNIQUE,
  passwordHash VARCHAR(200) NOT NULL,
  name VARCHAR(45) NOT NULL,
  birthDate DATE NOT NULL,
  gender VARCHAR(45) NULL,
  administrator TINYINT NULL,
  PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS SavedProducts (
  userId INT NOT NULL,
  productId INT NOT NULL,
  PRIMARY KEY (userId, productId),
  FOREIGN KEY (userId) REFERENCES Users (userId),
  FOREIGN KEY (productId) REFERENCES Products (productId)
);

CREATE TABLE IF NOT EXISTS UserSessions (
  sessionHash VARCHAR(32) NOT NULL,
  userId INT NOT NULL,
  loginDate DATETIME NOT NULL,
  expires DATETIME NOT NULL,
  PRIMARY KEY (sessionHash),
  FOREIGN KEY (userId) REFERENCES Users (userId)
);

CREATE TABLE IF NOT EXISTS PasswordChangeRequests (
  requestId INT NOT NULL AUTO_INCREMENT,
  requestCode INT NOT NULL, 
  requestDate DATETIME NOT NULL,
  userId INT NOT NULL,
  used TINYINT NOT NULL,
  PRIMARY KEY (requestId),
  FOREIGN KEY (userId) REFERENCES Users (userId)
);

DELIMITER $$
DROP PROCEDURE IF EXISTS insertProduct$$
CREATE PROCEDURE insertProduct(title VARCHAR(150), rating DECIMAL(4,2), price FLOAT, description LONGTEXT, url VARCHAR(500), image VARCHAR(300), platformId INT, categoryId INT, ratingAmount INT)
BEGIN
  INSERT INTO Products (productId, title, rating, ratingAmount, price, description, url, image, platformId, hidden, categoryId) 
  VALUES (default, title, rating, ratingAmount, price, description, url, image, platformId, 0, categoryId);
END$$

DROP PROCEDURE IF EXISTS insertUser$$
CREATE PROCEDURE insertUser(email VARCHAR(75), passwordHash VARCHAR(200), name VARCHAR(45), birthDate DATE, gender VARCHAR(45))
BEGIN
  INSERT INTO Users VALUES (default, email, passwordHash, name, birthDate, gender, 0);
END$$

DROP PROCEDURE IF EXISTS createUserSession$$
CREATE PROCEDURE createUserSession(sessionHash VARCHAR(32), userId INT, loginDate DATETIME, expires DATETIME)
BEGIN
  INSERT INTO UserSessions VALUES (sessionHash, userId, loginDate, expires);
END$$

DROP PROCEDURE IF EXISTS createPasswordChangeRequest$$
CREATE PROCEDURE createPasswordChangeRequest(requestCode INT, requestDate DATETIME, userId INT)
BEGIN
  INSERT INTO PasswordChangeRequests VALUES (default, requestCode, requestDate, userId, 0);
END$$

DROP PROCEDURE IF EXISTS finishPasswordChangeRequest$$
CREATE PROCEDURE finishPasswordChangeRequest(requestId INT)
BEGIN
  UPDATE PasswordChangeRequests SET used = 1 WHERE PasswordChangeRequests.requestId = requestId;
END$$

DROP PROCEDURE IF EXISTS hideProduct$$
CREATE PROCEDURE hideProduct(userId INT, productId INT)
BEGIN
  SET @isAdm = 0;
  SET @isHidden = 0;
  SELECT administrator INTO @isAdm FROM Users WHERE Users.userId = userId;
  SELECT hidden INTO @isHidden FROM Products WHERE Products.productId = productId;
  IF @isAdm = 1 AND @isHidden = 0 THEN
    UPDATE Products SET hidden = 1 WHERE Products.productId = productId;
    SELECT 1 AS code;
  ELSE
	  SELECT 0 AS code;
  END IF;
END$$

DROP PROCEDURE IF EXISTS unhideProduct$$
CREATE PROCEDURE unhideProduct(userId INT, productId INT)
BEGIN
  SET @isAdm = 0;
  SET @isHidden = 0;
  SELECT administrator INTO @isAdm FROM Users WHERE Users.userId = userId;
  SELECT hidden INTO @isHidden FROM Products WHERE Products.productId = productId;
  IF @isAdm = 1 AND @isHidden = 1 THEN
    UPDATE Products SET hidden = 0 WHERE Products.productId = productId;
    SELECT 1 AS code;
  ELSE
	  SELECT 0 AS code;
  END IF;
END$$

DROP PROCEDURE IF EXISTS saveProduct$$
CREATE PROCEDURE saveProduct(userId INT, productId INT)
BEGIN
  INSERT INTO SavedProducts VALUES (userId, productId);
END$$

DROP PROCEDURE IF EXISTS unsaveProduct$$
CREATE PROCEDURE unsaveProduct(userId INT, productId INT)
BEGIN
  DELETE FROM SavedProducts WHERE SavedProducts.productId = productId AND SavedProducts.userId = userId;
END$$

DROP PROCEDURE IF EXISTS setupDatabase$$
CREATE PROCEDURE setupDatabase()
BEGIN
  IF (SELECT COUNT(*) FROM Users) = 0 THEN
    INSERT INTO Users VALUES 
    (default, 'teste@gmail.com', '$2b$10$XEshipSx2xW7XZ8PpT3CeOyy/JvFB/FfIPYcWvzYDSm5jQ3uGZO/i', 'teste', '2005-05-11', 'M', 1);

    INSERT INTO Platforms VALUES 
    (default, 'EnergiaTotal', 'https://www.energiatotal.com.br'),
    (default, 'Leroy Merlin', 'https://www.leroymerlin.com.br/'),
    (default, 'Magazine Luiza', 'https://www.magazineluiza.com.br/'),
    (default, 'Mercado Livre', 'https://www.mercadolivre.com.br/'),
    (default, 'Minha Casa Solar', 'https://www.minhacasasolar.com.br/'),
    (default, 'NeoSolar', 'https://www.neosolar.com.br/loja');

    INSERT INTO Categories VALUES 
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
  END IF;
END$$
DELIMITER ;

CALL setupDatabase();