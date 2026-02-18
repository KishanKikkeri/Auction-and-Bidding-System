# BidSnap - Online Auction System

BidSnap is an online auction platform where users can bid on various items. The system is built using a modern tech stack including React, Vite, Flask, and MySQL.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

- User Authentication (Sign Up, Login, Logout)
- Bid on items
- View bid history
- User profile management
- Responsive design

## Tech Stack

**Client:**

- React
- Vite
- Tailwind CSS

**Server:**

- Flask
- MySQL

## Installation

### Prerequisites

- Node.js
- Python 3.x
- MySQL


   Clone the repository
   ```sh
   git clone https://github.com/sreyas-b-anand/dbms-mini-project.git

### Client

1. Navigate to the `client` directory:

   ```sh
   cd client
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Server

1. Navigate to the directory:

   ```sh
   cd server
   ```

2. Create a `.env` file and add your MySQL database credentials:

   ```env
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   ```

3. Install dependencies:

   ```sh
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```sh
   python main.py
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173` to access the client.
2. Use `http://localhost:5000` for server-side API requests.


## License

This project is licensed under the MIT License.
