CREATE TABLE `users` (
  `user_id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `age` char(6) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `metadata_1` text DEFAULT NULL,
  `metadata_2` text DEFAULT NULL,
  `metadata_3` text DEFAULT NULL,
  `metadata_4` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`,`email`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `nickname_UNIQUE` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=55864582 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci