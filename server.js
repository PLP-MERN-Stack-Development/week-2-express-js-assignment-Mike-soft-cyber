// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/products', async (req, res) => {
  res.json(products);
});
// GET /api/products/:id - Get a specific product
app.get('/products/:id', async (req, res) => {
  const product = products.find(p =>p.id === Number(req.params.id));
  if(!product) return res.status(404).send('Product not found');
  res.json(product);
})
// POST /api/products - Create a new product
app.post('/products',validateProduct ,(req, res) => {
  const newProduct = { id: uuidv4(), ...req.body};
  products.push(newProduct);
  res.status(210).json(newProduct);
})
// PUT /api/products/:id - Update a product
app.put('/products/:id', validateProduct, (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if(!user) return res.status(404).send('Product not found');
  Object.assign(product, req.body);
  res.json(product);
})
// DELETE /api/products/:id - Delete a product
app.delete('/products/:id', (req, res) => {
  products = products.find(p => p.id === Number(req.params.id));
  res.status(204).send();
})

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// - Authentication
app.use((req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (apiKey !== '12345') {
    return res.status(401).json({ error: 'Unauthorized. Missing or invalid API key.' });
  }
  next();
});
// - Error handling
app.use((err, req, res, next) => {
  console.error('Internal server error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Middleware to validate product data
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ error: 'Invalid product data' });
  }
  next();
}

// Pagination
app.get('/products', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: products.length,
    products: paginatedProducts
  });
});

// filtering
app.get('/products', (req, res) => {
  const { category, inStock } = req.query;
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  if (inStock !== undefined) {
    const inStockBool = inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === inStockBool);
  }

  res.json(filteredProducts);
});

// Search
app.get('/products/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.description.toLowerCase().includes(q.toLowerCase())
  );

  res.json(searchResults);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 