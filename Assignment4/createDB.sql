DROP DATABASE IF EXISTS SongsDb;

CREATE DATABASE SongsDb;
USE SongsDb;

CREATE TABLE Users (
  Id int NOT NULL AUTO_INCREMENT,
  Email varchar(255) UNIQUE NOT NULL,
  Password varchar(60) NOT NULL,
  PRIMARY KEY(Id)
);

CREATE TABLE Songs (
  Id int NOT NULL AUTO_INCREMENT,
  Name varchar(255) NOT NULL,
  UserId int NOT NULL REFERENCES Users(Id),
  PRIMARY KEY(Id),
  UNIQUE KEY `UniqueUserIdAndName` (`UserId`,`Name`)
);

INSERT INTO Users(Email, Password) VALUES('michael.desanty@mcla.edu', '$2a$12$JkYCRUKgUW/QpHDc3Lyt2ueCX8x.KQJZMba7nrh/ejoRUC5ZYatf6');
SET @userId = (SELECT Id FROM Users WHERE Email = 'michael.desanty@mcla.edu');

INSERT INTO Songs(UserId, Name) VALUES(@userId, 'Happy Birthday');
INSERT INTO Songs(UserId, Name) VALUES(@userId, 'Mary Had a Little Lamb');
INSERT INTO Songs(UserId, Name) VALUES(@userId, 'Circles');
INSERT INTO Songs(UserId, Name) VALUES(@userId, 'Kryptonite');

INSERT INTO Users(Email, Password) VALUES('bob@a.com', '$2a$12$5hangnH270d7EPFQm5a0FeRLPRkJtSn3IAFpDZYyRCRRxIxlyG0Xe');
SET @userId = (SELECT Id FROM Users WHERE Email = 'bob@a.com');

INSERT INTO Songs(UserId, Name) VALUES(@userId, 'Bad Guy');
INSERT INTO Songs(UserId, Name) VALUES(@userId, 'Blurry');
