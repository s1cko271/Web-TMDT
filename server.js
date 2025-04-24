const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const db = require('./config/db');

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('images')); // Serve static images

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('School Store API is running');
});

// Start server after ensuring database connection
const PORT = process.env.PORT || 5000;

// Function to start the server
async function startServer() {
  try {
    // Test database connection before starting server
    const connection = await db.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    
    // Start the server after successful database connection
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // If port is in use, try another port
        const newPort = parseInt(PORT) + 1;
        console.log(`Port ${PORT} is already in use, trying port ${newPort}...`);
        server.close();
        app.listen(newPort, () => {
          console.log(`Server running on port ${newPort}`);
        });
      } else {
        console.error('Server error:', err);
      }
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    console.log('Retrying database connection in 5 seconds...');
    setTimeout(startServer, 5000); // Retry after 5 seconds
  }
}

// Start the server
startServer();