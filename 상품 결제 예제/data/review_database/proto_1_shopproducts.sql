CREATE DATABASE  IF NOT EXISTS `proto_1` ;
USE `proto_1`;

DROP TABLE IF EXISTS `shopproducts`;

CREATE TABLE `shopproducts` (
  `prodid` int NOT NULL AUTO_INCREMENT,
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `thumbnail` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` int NOT NULL,
  `date` datetime NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`prodid`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `shopproducts` VALUES (1,'아이언맨',1200,'http://localhost:8000/picture1.jpg',1,'2024-05-15 13:38:31',NULL),
(2,'캡틴 아메리카',1600,'http://localhost:8000/picture2.jpg',1,'2024-05-15 13:41:00','<p>세일 많이 들어갔습니다</p>'), 
(3,'닥터 스트레인저',1800,'http://localhost:8000/picture3.jpg',1,'2024-05-15 13:38:31',NULL);

UNLOCK TABLES;

