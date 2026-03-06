USE auction_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    role VARCHAR(50),
    wallet FLOAT DEFAULT 0,
    img VARCHAR(500),
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    starting_price FLOAT NOT NULL,
    current_price FLOAT NOT NULL,
    category VARCHAR(100),
    `condition` VARCHAR(50),
    seller_id INT NOT NULL,
    auction_end DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    winner_id INT,
    
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE bids (
    bid_id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    user_id INT NOT NULL,
    current_price INT NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    winner_id INT
);

CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    item_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    final_price FLOAT NOT NULL,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

SHOW TABLES;