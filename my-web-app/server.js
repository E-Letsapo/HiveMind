const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

// Set up a connection pool
const pool = new Pool({
  user: 'citus',
  host: 'localhost',
  database: 'citus',
  password: 'citus',
  port: 5432,
});

// Middleware to parse request body as JSON
app.use(express.json());

// Enable CORS for requests from localhost:300$
const allowedOrigins = [
  'http://localhost:3000',
];

app.use(cors({
  origin: allowedOrigins
}));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Hivemind DBMs hello!!');
});

app.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === 'citus') {
    const workerNodes = ['NUL', 'CAS', 'LIPAM', 'LP', 'LEC', 'IDM', 'LAC', 'MOET'];
    const selectedWorkerNode = workerNodes.includes(req.body.workerNode) ? req.body.workerNode : ' ';
    
    // Configure the database connection based on the selected worker node
    let pool = new Pool({
      user: 'citus',
      password: 'citus',
      host: selectedWorkerNode.toLowerCase(),
      port: 5432,
      database: 'citus',
    });

    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});