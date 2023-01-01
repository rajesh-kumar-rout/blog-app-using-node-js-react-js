CREATE TABLE b_users (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `email` VARCHAR(30) NOT NULL UNIQUE,
    `password` VARCHAR(100) NOT NULL,
    `profileImgUrl` VARCHAR(100),
    `profileImgId` VARCHAR(100),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE b_categories (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE b_blogs (
    `id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `imgUrl` VARCHAR(100),
    `imgId` VARCHAR(100),
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `userId` BIGINT(20),
    `categoryId` BIGINT(20),
    FOREIGN KEY (`userId`) REFERENCES `b_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`categoryId`) REFERENCES `b_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO b_categories (name) VALUES 
('Sports'),
('Education'),
('IT'),
('Coding'),
('Technology');
