//nul-server.js
const express = require('express');
const http = require('http');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3002;

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
  res.status(200).send('NUL DBMs hello!!');
});

// Additional routes and functionality specific to the "NUL" worker node can be added here

// Route handler for "/tables"
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

// Get data for a specific id on specific table
app.get('/:table/:id', async (req, res) => {
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

// Search for a specific ID in the database
app.get('/search/:table/:id', async (req, res) => {
  const { table, id } = req.params;

  try {
    const query = `SELECT * FROM ${table} WHERE ${table}_id = $1`;
    const result = await pool.query(query, [id]);
    const data = result.rows;
    res.json(data);
  } catch (error) {
    console.error('Error searching for ID:', error);
    res.status(500).json({ error: 'An error occurred while searching for ID' });
  }
});

// Delete data for a specific table and ID
app.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  const { cascade } = req.query;

  try {
    let columnName;
    if (table == 'lecturers')
    {
      columnName = 'lecturer_id';
    }
    const query = `DELETE FROM ${table} WHERE ${columnName} = $1`;
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
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

//insert on students table
app.post('/students', async (req, res) => {
  const { student_id, university_name, arrival_year, completion_year, year_of_study } = req.body;

  try {
    await pool.query('INSERT INTO Students (student_id, university_name, arrival_year, completion_year, year_of_study) VALUES ($1, $2, $3, $4, $5)', [student_id, university_name, arrival_year, completion_year, year_of_study]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Delete method for students table
app.delete('/students/:student_id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM students WHERE student_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Student data deleted successfully' });
  } catch (error) {
    console.error('Error deleting student data:', error);
    res.status(500).json({ error: 'An error occurred while deleting student data' });
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

//insert into lecturers table
app.post('/lecturers', async (req, res) => {
  const { lecturer_id, university_name, arrival_year } = req.body;

  try {
    await pool.query('INSERT INTO Lecturers (lecturer_id, university_name, arrival_year) VALUES ($1, $2, $3)', [lecturer_id, university_name, arrival_year]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Delete method for lecturers table
app.delete('/lecturers/:lecturer_id', async (req, res) => {
  const { lecturer_id } = req.params;

  try {
    const query = 'DELETE FROM lecturers WHERE lecturer_id = $1';
    await pool.query(query, [lecturer_id]);
    res.json({ message: 'Lecturer data deleted successfully' });

  } catch (error) {
    console.error('Error deleting lecturer data:', error);
    res.status(500).json({ error: 'An error occurred while deleting lecturer data' });
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

//insert into student personal info
app.post('/spersonalinfo', async (req, res) => {
  const { spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_name } = req.body;

  try {
    await pool.query('INSERT INTO SPersonal_info (spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_name]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
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

//insert into lecturers personal info
app.post('/lpersonalinfo', async (req, res) => {
  const { lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_name } = req.body;

  try {
    await pool.query('INSERT INTO LPersonal_info (lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_name]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
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

//insert into students academic records
app.post('/sacademicrecords', async (req, res) => {
  const { sacademic_id, academic_year, student_id, university_name } = req.body;

  try {
    await pool.query('INSERT INTO SAcademic_records (sacademic_id, academic_year, student_id, university_name) VALUES ($1, $2, $3, $4)', [sacademic_id, academic_year, student_id, university_name]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Get all academic records for lecturers
app.get('/lacademic_records', async (req, res) => {
  try {
    const query = 'SELECT * FROM lacademic_records';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching lecturer academic records' });
  }
});

//insert into lecturers academic records
app.post('/lacademicrecords', async (req, res) => {
  const { lacademic_id, academic_year, lecturer_id, title, university_name } = req.body;

  try {
    await pool.query('INSERT INTO LAcademic_records (lacademic_id, academic_year, lecturer_id, title, university_name) VALUES ($1, $2, $3, $4, $5)', [lacademic_id, academic_year, lecturer_id, title, university_name]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Get all results reports
app.get('/results_reports', async (req, res) => {
  try {
    const query = 'SELECT * FROM results_reports';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching results reports' });
  }
});

// Get all budgets reports
app.get('/budgets_reports', async (req, res) => {
  try {
    const query = 'SELECT * FROM budgets_reports';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching budgets reports' });
  }
});

// Get all facilities reports
app.get('/facilities_reports', async (req, res) => {
  try {
    const query = 'SELECT * FROM facilities_reports';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching facilities reports' });
  }
});

// Final_reports table endpoint
app.get('/final_reports', async (req, res) => {
  try {
    const query = 'SELECT * FROM final_reports';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching library information' });
  }
});

// MOET table endpoint
app.get('/moet', async (req, res) => {
  try {
    const query = 'SELECT * FROM moet';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching moet information' });
  }
});

// Library table endpoint
app.get('/library',async (req, res) => {
  try {
    const query = 'SELECT * FROM library';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching library' });
  }
});

// Get all library information
app.get('/library_information', async (req, res) => {
  try {
    const query = 'SELECT * FROM library_information';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching library information' });
  }
});

// Get all funding records
app.get('/funding', async (req, res) => {
  try {
    const query = 'SELECT * FROM funding';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching funding records' });
  }
});

// Get all projects
app.get('/projects', async (req, res) => {
  try {
    const query = 'SELECT * FROM projects';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching projects' });
  }
});

// Get all FProjects
app.get('/fprojects', async (req, res) => {
  try {
    const query = 'SELECT * FROM fprojects';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching FProjects' });
  }
});

// Delete method for spersonal_info table
app.delete('/spersonal_info/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM spersonal_info WHERE spersonal_info_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Student personal info data deleted successfully' });
  } catch (error) {
    console.error('Error deleting student personal info data:', error);
    res.status(500).json({ error: 'An error occurred while deleting student personal info data' });
  }
});

// Delete method for lpersonal_info table
app.delete('/lpersonal_info/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM lpersonal_info WHERE lpersonal_info_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Lecturer personal info data deleted successfully' });
  } catch (error) {
    console.error('Error deleting lecturer personal info data:', error);
    res.status(500).json({ error: 'An error occurred while deleting lecturer personal info data' });
  }
});

// Delete method for sacademic_records table
app.delete('/sacademic_records/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM sacademic_records WHERE sacademic_records_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Student academic records data deleted successfully' });
  } catch (error) {
    console.error('Error deleting student academic records data:', error);
    res.status(500).json({ error: 'An error occurred while deleting student academic records data' });
  }
});

// Delete method for lacademic_records table
app.delete('/lacademic_records/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM lacademic_records WHERE lacademic_records_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Lecturer academic records data deleted successfully' });
  } catch (error) {
    console.error('Error deleting lecturer academic records data:', error);
    res.status(500).json({ error: 'An error occurred while deleting lecturer academic records data' });
  }
});

// Delete data from the 'results_reports' table
app.delete('/results_reports/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM results_reports WHERE report_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'budgets_reports' table
app.delete('/budgets_reports/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM budgets_reports WHERE report_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'facilities_reports' table
app.delete('/facilities_reports/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM facilities_reports WHERE report_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'final_reports' table
app.delete('/final_reports/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM final_reports WHERE report_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'faculties' table
app.delete('/faculties/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM moet WHERE faculty_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'library' table
app.delete('/library/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM library WHERE library_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'library_information' table
app.delete('/library_information/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM library_information WHERE info_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'funding' table
app.delete('/funding/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM funding WHERE funding_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'projects' table
app.delete('/projects/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM projects WHERE project_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Delete data from the 'fprojects' table
app.delete('/fprojects/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const query = 'DELETE FROM fprojects WHERE fproject_id = $1';
    await pool.query(query, [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'An error occurred while deleting data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`NUL server running on port ${port}`);
});
