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
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:3006',
  'http://localhost:3007',
  'http://localhost:3008',
  'http://localhost:3009'
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

// Get all students
app.get('/students', async (req, res) => {
  try {
    const query = 'SELECT * FROM students';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching students' });
  }
});

// Insert a new student
app.post('/students', async (req, res) => {
  const { student_id, university_name, arrival_year, completion_year, year_of_study } = req.body;
  try {
    const query = 'INSERT INTO students (student_id, university_name, arrival_year, completion_year, year_of_study) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(query, [student_id, university_name, arrival_year, completion_year, year_of_study]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while inserting a student' });
  }
});

// Update a student
app.put('/students/:student_id/:university_name', async (req, res) => {
  const { student_id, university_name } = req.params;
  const { arrival_year, completion_year, year_of_study } = req.body;
  try {
    const query = 'UPDATE students SET arrival_year = $1, completion_year = $2, year_of_study = $3 WHERE student_id = $4 AND university_name = $5';
    await pool.query(query, [arrival_year, completion_year, year_of_study, student_id, university_name]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the student' });
  }
});

// Delete a student
app.delete('/students/:student_id/:university_name', async (req, res) => {
  const { student_id, university_name } = req.params;
  try {
    const query = 'DELETE FROM students WHERE student_id = $1 AND university_name = $2';
    await pool.query(query, [student_id, university_name]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the student' });
  }
});

// Get all lecturers
app.get('/lecturers', async (req, res) => {
  try {
    const query = 'SELECT * FROM lecturers';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching lecturers' });
  }
});

// Insert a new lecturer
app.post('/lecturers', async (req, res) => {
  const { lecturer_id, university_name, arrival_year} = req.body;
  try {
    const query = 'INSERT INTO lecturers (lecturer_id, university_name,arrival_year) VALUES ($1, $2, $3)';
    await pool.query(query, [lecturer_id, university_name, arrival_year]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while inserting a lecturer' });
  }
});

// Update a lecturer
app.put('/lecturers/:lecturer_id/:university_name/:arrival_year', async (req, res) => {
  const { lecturer_id, university_name, arrival_year } = req.params;
  try {
    const query = 'UPDATE lecturers SET university_name = $1 WHERE lecturer_id = $2 AND university_name = $3';
    await pool.query(query, [university_name, arrival_year, lecturer_id, university_name]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the lecturer' });
  }
});

// Delete a lecturer
app.delete('/lecturers/:lecturer_id/:university_name', async (req, res) => {
  const { lecturer_id, university_name } = req.params;
  try {
    const query = 'DELETE FROM lecturers WHERE lecturer_id = $1 AND university_name = $2';
    await pool.query(query, [lecturer_id, university_name]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the lecturer' });
  }
});
// Get all students' personal info
app.get('/students/personal-info', async (req, res) => {
  try {
    const query = 'SELECT * FROM spersonal_info';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching students\'personal info' });
  }
});

// Insert a new student's personal info
app.post('/students/personal-info', async (req, res) => {
  const { spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_name } = req.body;
  try {
    const query = 'INSERT INTO spersonal_info (spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    await pool.query(query, [spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_name]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while inserting a student\'s personal info' });
  }
});

// Update a student's personal info
app.put('/students/personal-info/:spersonal_info_id/:student_id', async (req, res) => {
  const { spersonal_info_id, student_id } = req.params;
  const { first_name, middle_name, last_name, id_number, district, contact, university_name } = req.body;
  try {
    const query = 'UPDATE spersonal_info SET first_name = $1, middle_name = $2, last_name = $3, id_number = $4, district = $5, contact = $6, university_name = $7 WHERE spersonal_info_id = $8 AND student_id = $9';
    await pool.query(query, [first_name, middle_name, last_name, id_number, district, contact, university_name, spersonal_info_id, student_id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the student\'s personal info' });
  }
});

// Delete a student's personal info
app.delete('/students/personal-info/:spersonal_info_id/:student_id', async (req, res) => {
  const { spersonal_info_id, student_id } = req.params;
  try {
    const query = 'DELETE FROM spersonal_info WHERE spersonal_info_id = $1 AND student_id = $2';
    await pool.query(query, [spersonal_info_id, student_id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the student\'s personal info' });
  }
});

// Get all lecturers' personal info
app.get('/lecturers/personal-info', async (req, res) => {
  try {
    const query = 'SELECT * FROM lpersonal_info';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching lecturers\' personal info' });
  }
});

// Insert a new lecturer's personal info
app.post('/lecturers/personal-info', async (req, res) => {
  const { lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_name } = req.body;
  try {
    const query = 'INSERT INTO lpersonal_info (lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
    await pool.query(query, [lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_name]);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while inserting a lecturer\'s personal info' });
  }
});

// Update a lecturer's personal info
app.put('/lecturers/personal-info/:lpersonal_info_id/:lecturer_id', async (req, res) => {
  const { lpersonal_info_id, lecturer_id } = req.params;
  const { first_name, middle_name, last_name, id_number, district, contact, university_name } = req.body;
  try {
    const query = 'UPDATE lpersonal_info SET first_name = $1, middle_name = $2, last_name = $3, id_number = $4, district = $5, contact = $6, university_name = $7 WHERE lpersonal_info_id = $8 AND lecturer_id = $9';
    await pool.query(query, [first_name, middle_name, last_name, id_number, district, contact, university_name, lpersonal_info_id, lecturer_id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the lecturer\'s personal info' });
  }
});

// Delete a lecturer's personal info
app.delete('/lecturers/personal-info/:lpersonal_info_id/:lecturer_id', async (req, res) => {
  const { lpersonal_info_id, lecturer_id } = req.params;
  try {
    const query = 'DELETE FROM lpersonal_info WHERE lpersonal_info_id = $1 AND lecturer_id = $2';
    await pool.query(query, [lpersonal_info_id, lecturer_id]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the lecturer\'s personal info' });
  }
});

// Get all academic records for students
app.get('/sacademic_records', async (req, res) => {
  try {
    const query = 'SELECT * FROM sacademic_records';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching student academic records' });
  }
});

// Get all tables
app.get('/tables', async (req, res) => {
  try {
    const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'citus'";
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

  try {
    const query = `SELECT * FROM ${table}`;
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
  console.log(`Server is running on port ${port}`);
});