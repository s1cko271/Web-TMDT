const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const productRoutes = require('./routes/products');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('images')); // Serve static images

// Routes
app.use('/api/products', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('School Store API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});