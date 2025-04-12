# School Store API Documentation

## Overview
This document provides information about the School Store API endpoints, authentication, and middleware.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Token) for authentication. Protected routes require a valid token in the `x-auth-token` header.

### Getting a Token
To get a token, you need to register or login:

```
POST /api/users/register
POST /api/users/login
```

Both endpoints will return a token in the response if successful.

## API Endpoints

### Products

- `GET /api/products` - Get all products (supports filtering, sorting, pagination)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create a new product (protected)
- `PUT /api/products/:id` - Update a product (protected)
- `DELETE /api/products/:id` - Delete a product (protected)

### Users

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile (protected)
- `PUT /api/users/profile/:id` - Update user profile (protected)
- `PUT /api/users/change-password/:id` - Change user password (protected)

### Cart

- `GET /api/cart/:userId` - Get cart items for a user (protected)
- `POST /api/cart/:userId/items` - Add item to cart (protected)
- `PUT /api/cart/:userId/items/:itemId` - Update cart item quantity (protected)
- `DELETE /api/cart/:userId/items/:itemId` - Remove item from cart (protected)
- `DELETE /api/cart/:userId` - Clear cart (protected)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:categoryName/products` - Get products by category name

## Middleware

### Authentication Middleware
The API uses a custom authentication middleware to protect routes that require authentication.

```javascript
// Example of using the auth middleware in a route
const { verifyToken } = require('../middleware/auth');

router.get('/protected-route', verifyToken, (req, res) => {
  // Only accessible with valid token
});
```

### Error Handling
The API includes global error handling middleware to provide consistent error responses.

### Validation
Request validation middleware is available for validating user input and ensuring data integrity.

## Database
The application uses MySQL for data storage with the following main tables:

- `users` - User accounts and profiles
- `school_supplies` - Product information
- `carts` - User shopping carts
- `cart_items` - Items in user carts

## Environment Variables
The following environment variables are required:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=27012003
DB_NAME=school_store
DB_PORT=3306
PORT=5000
JWT_SECRET=your_jwt_secret
```