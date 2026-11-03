# 🛒 Smart Shop - Backend

Smart Shop is a modern and responsive e-commerce application that provides a user-friendly online shopping experience. It allows users to explore products, browse categories, and manage their shopping activities through an intuitive 

## 🛠️ Technologies & Dependencies

### Core Technologies
- Node.js - JavaScript runtime environment
- Express.js - Backend web framework
- MongoDB - NoSQL database
- Mongoose - MongoDB object modeling

### Authentication & Security
- Bcrypt.js - Password hashing and comparison
- Express Session - Session-based authentication (No JWT)
- Connect Mongo - Store user sessions in MongoDB
- Helmet - Secure HTTP headers

### Email & Configuration
- Nodemailer - Sending password reset emails
- Dotenv - Environment variable management

### Error Handling & Validation
- Express Async Handler - Handling asynchronous errors
- Express Validator - Request validation package

### Development Tools
- Nodemon - Automatically restarts the server during development

## 📂 Project Structure


## ✨ Features Implemented


## 🛣️ API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & create session | Public |
| POST | `/api/auth/logout` | Logout & destroy session | Private |
| GET | `/api/auth/me` | Get current user profile | Private |
| POST | `/api/auth/forgotpassword` | Request password reset link | Public |
| POST | `/api/auth/resetpassword/:token`| Reset password with token | Public |

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone git@github.com:thydevelopment/smart-shop.git
cd backend