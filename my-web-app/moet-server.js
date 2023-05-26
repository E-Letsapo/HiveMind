const express = require('express');
const http = require('http');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3009;

// Set up a connection pool
const pool = new Pool({
  user: 'citus',
  host: 'localhost',
  database: 'citus',
  password: 'citus',
  port: 5432,
});

// Enable CORS for requests from localhost:3000 to localhost:3009
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5432'
];

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('ALL HLIs DBMs hello!!');
});

// Route handler for "/tables"
app.get('/tables', async (req, res) => {
  try {
    const { filter } = req.query;
    let query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'citus'";
    
    if (filter) {
      query += ` AND university_id = '${filter}'`;
    }
    
    const result = await pool.query(query);
    const tables = result.rows.map(row => row.table_name);
    res.json(tables);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'An error occurred while fetching tables' });
  }
});


// Get data for a specific table
app.get('/:table', async (req, res) => {
  const { table } = req.params;
  const { filter } = req.query;

  try {
    let query = `SELECT * FROM ${table}`;

    if (filter) {
      query += ` WHERE university_id = '${filter}'`;
    }

    const result = await pool.query(query);
    const data = result.rows;
    res.json(data);
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ error: 'An error occurred while fetching table data' });
  }
});

// Start the server
app.listen(port, () => {
    console.log(`MOET server running on port ${port}`);
  });