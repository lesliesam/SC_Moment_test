-- MySQL dump 10.13  Distrib 8.0.12, for macos10.13 (x86_64)
--
-- Host: 127.0.0.1    Database: moment
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `moment`
--

DROP TABLE IF EXISTS `moment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `moment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `text` varchar(1000) DEFAULT NULL,
  `images` varchar(2000) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `moment_user_fk` (`user_id`),
  CONSTRAINT `moment_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moment`
--

LOCK TABLES `moment` WRITE;
/*!40000 ALTER TABLE `moment` DISABLE KEYS */;
INSERT INTO `moment` VALUES (6,7,'https image url','https://moment-images-test.oss-cn-shanghai.aliyuncs.com/77d7b0a6f59a874b63199bf45ef5529b_example.jpeg','2018-08-06 07:50:41'),(7,7,'8 images','https://moment-images-test.oss-cn-shanghai.aliyuncs.com/77d7b0a6f59a874b63199bf45ef5529b_example.jpeg,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/25900e9e38f942001838c2a4be32339f_example2.png,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/77d7b0a6f59a874b63199bf45ef5529b_example.jpeg,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/25900e9e38f942001838c2a4be32339f_example2.png,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/77d7b0a6f59a874b63199bf45ef5529b_example.jpeg,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/25900e9e38f942001838c2a4be32339f_example2.png,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/77d7b0a6f59a874b63199bf45ef5529b_example.jpeg,https://moment-images-test.oss-cn-shanghai.aliyuncs.com/25900e9e38f942001838c2a4be32339f_example2.png','2018-08-06 07:54:12');
/*!40000 ALTER TABLE `moment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-06 17:40:08
