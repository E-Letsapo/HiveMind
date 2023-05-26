//CODE 100% ORIGINAL BY HIVEMIND GROUP
//FOR FURTHER COMMUNICATION OR IF HAVING QUESTIONS REGARDING THE FUNCTIONS,
//PLEASE CONTACT +26650709108 OR EMAIL US AT edwardletsapo@gmail.com

//lipam-server.js code
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3004;

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
];

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.status(200).send('LIPAM DBMs hello!!');
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

// Update data for a specific table by ID
app.put('/:table/:id', [
  // Add input validation rules using express-validator or Joi
], async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const fields = Object.keys(data);
    const values = Object.values(data);

    // Check if the update ID exists in the selected table
    const selectQuery = `SELECT ${table}_id FROM ${table} WHERE ${table}_id = $1`;
    const selectParams = [id];
    const selectResult = await pool.query(selectQuery, selectParams);

    if (selectResult.rowCount === 0) {
      return res.status(404).json({ error: 'No matching records found' });
    }

    // Update the main table
    const updateParams = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const query = `UPDATE ${table} SET ${updateParams} WHERE ${table}_id = $1`;
    const queryParams = [id, ...values];
    console.log('Query:', query);
    console.log('Query Params:', queryParams);

    await pool.query(query, queryParams);

    // Search and update referenced tables
   
    for (const referencingTable of referencingTables) {
      const updateReferencingTableQuery = `
        UPDATE ${referencingTable}
        SET ${referencingColumns.map(column => `${column} = $1`).join(', ')}
        WHERE ${table}_id = $2
      `;
      const updateReferencingTableParams = [id, ...values];
      await pool.query(updateReferencingTableQuery, updateReferencingTableParams);
    }

    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating table data:', error);
    res.status(500).json({ error: 'An error occurred while updating table data' });
  }
});

// Search for a specific ID in the database
app.get('/:table/:id', async (req, res) => {
  const { table, id } = req.params; // Extract the 'table' and 'id' parameters from the route URL

  try {
    const query = `SELECT * FROM ${table} WHERE ${table}::text ILIKE '%' || $1 || '%'`;
    const result = await pool.query(query, [id]);
    const data = result.rows;
    res.json(data);
  } catch (error) {
    console.error('Error searching for ID:', error);
    res.status(500).json({ error: 'An error occurred while searching for ID' });
  }
});

// Delete data for a specific table by ID
// Delete data for a specific table or all tables by ID
app.delete('/:table/:id', async (req, res) => {
  const { table, id } = req.params;

  try {
    // Delete the record from the selected table
    const deleteQuery = `DELETE FROM ${table} WHERE ${table}_id = $1`;
    const deleteParams = [id];
    await pool.query(deleteQuery, deleteParams);

    // Delete the record from all referencing tables
    const referencingTablesQuery = `SELECT table_name, column_name
      FROM information_schema.key_column_usage
      WHERE referenced_table_name = $1`;

    const referencingTablesParams = [table];
    const referencingTablesResult = await pool.query(referencingTablesQuery, referencingTablesParams);
    const referencingTables = referencingTablesResult.rows;

    for (const referencingTable of referencingTables) {
      const { table_name, column_name } = referencingTable;
      const deleteReferencingTableQuery = `DELETE FROM ${table_name} WHERE ${column_name} = $1`;
      const deleteReferencingTableParams = [id];
      await pool.query(deleteReferencingTableQuery, deleteReferencingTableParams);
    }

    res.json({ success: true, message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ success: false, error: 'An error occurred while deleting data' });
  }
});

// Get all student
app.get('/student', async (req, res) => {
  try {
    const query = 'SELECT * FROM student';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching student' });
  }
});

//insert on student table
app.post('/student', async (req, res) => {
  const { student_id, university_id, arrival_year, completion_year, year_of_study } = req.body;

  try {
    await pool.query('INSERT INTO student (student_id, university_id, arrival_year, completion_year, year_of_study) VALUES ($1, $2, $3, $4, $5)', [student_id, university_id, arrival_year, completion_year, year_of_study]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update student by ID
app.put('/student/:id', async (req, res) => {
  const { id } = req.params;
  const { student_id, university_id, arrival_year, completion_year, year_of_study } = req.body;

  try {
    await pool.query('UPDATE student SET student_id = $1, university_id = $2, arrival_year = $3, completion_year = $4, year_of_study = $5 WHERE id = $6',
      [student_id, university_id, arrival_year, completion_year, year_of_study, id]);

    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'An error occurred while updating data' });
  }
});

// Get all lecturer
app.get('/lecturer', async (req, res) => {
  try {
    const query = 'SELECT * FROM lecturer';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching lecturer' });
  }
});

//insert into lecturer table
app.post('/lecturer', async (req, res) => {
  const { lecturer_id, university_id, arrival_year } = req.body;

  try {
    await pool.query('INSERT INTO lecturer (lecturer_id, university_id, arrival_year) VALUES ($1, $2, $3)', [lecturer_id, university_id, arrival_year]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update lecturer by ID
app.put('/lecturer/:id', async (req, res) => {
  const { id } = req.params;
  const { lecturer_id, university_id, arrival_year } = req.body;

  try {
    await pool.query('UPDATE lecturer SET lecturer_id = $1, university_id = $2, arrival_year = $3 WHERE id = $4',
      [lecturer_id, university_id, arrival_year, id]);

    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'An error occurred while updating data' });
  }
});

// Get all student' personal info
app.get('/spersonal_info', async (req, res) => {
  try {
    const query = 'SELECT * FROM spersonal_info';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching student\'personal info' });
  }
});

//insert into student personal info
app.post('/spersonal_info', async (req, res) => {
  const { spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_id } = req.body;

  try {
    await pool.query('INSERT INTO SPersonal_info (spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update student personal info by ID
app.put('/spersonal_info/:id', async (req, res) => {
  const { id } = req.params;
  const { spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_id } = req.body;

  try {
    await pool.query('UPDATE spersonal_info SET spersonal_info_id = $1, student_id = $2, first_name = $3, middle_name = $4, last_name = $5, id_number = $6, district = $7, contact = $8, university_id = $9 WHERE id = $10',
      [spersonal_info_id, student_id, first_name, middle_name, last_name, id_number, district, contact, university_id, id]);

    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'An error occurred while updating data' });
  }
});

// Get all lecturer' personal info
app.get('/lpersonal_info', async (req, res) => {
  try {
    const query = 'SELECT * FROM lpersonal_info';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching lecturer\' personal info' });
  }
});

//insert into lecturer personal info
app.post('/lpersonal_info', async (req, res) => {
  const { lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_id } = req.body;

  try {
    await pool.query('INSERT INTO LPersonal_info (lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update lecturer' personal info by ID
app.put('/lpersonal_info/:id', async (req, res) => {
  const { id } = req.params;
  const { lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_id } = req.body;

  try {
    const query = 'UPDATE lpersonal_info SET lpersonal_info_id = $1, lecturer_id = $2, first_name = $3, middle_name = $4, last_name = $5, id_number = $6, district = $7, contact = $8, university_id = $9 WHERE id = $10';
    const values = [lpersonal_info_id, lecturer_id, first_name, middle_name, last_name, id_number, district, contact, university_id, id];
    await pool.query(query, values);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating lecturer\' personal info:', error);
    res.status(500).json({ error: 'An error occurred while updating lecturer\' personal info' });
  }
});

// Get all semester
app.get('/semester', async (req, res) => {
  try {
    const query = 'SELECT * FROM semester';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching semester' });
  }
});

// Insert into semester table
app.post('/semester', async (req, res) => {
  const { semester_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO semester (semester_id, university_id) VALUES ($1, $2)', [semester_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update semester by ID
app.put('/semester/:id', async (req, res) => {
  const { id } = req.params;
  const { semester_id, university_id } = req.body;

  try {
    const query = 'UPDATE semester SET semester_id = $1, university_id = $2 WHERE id = $3';
    const values = [semester_id, university_id, id];
    await pool.query(query, values);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating semester:', error);
    res.status(500).json({ error: 'An error occurred while updating semester' });
  }
});

// Get all course
app.get('/course', async (req, res) => {
  try {
    const query = 'SELECT * FROM course';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching course' });
  }
});

// Insert into course table
app.post('/course', async (req, res) => {
  const { course_id, course_name, credit_hours, semester_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO course (course_id, course_name, credit_hours, semester_id, university_id) VALUES ($1, $2, $3, $4, $5)', [course_id, course_name, credit_hours, semester_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update course by ID
app.put('/course/:id', async (req, res) => {
  const { id } = req.params;
  const { course_id, course_name, credit_hours, semester_id, university_id } = req.body;

  try {
    const query = 'UPDATE course SET course_id = $1, course_name = $2, credit_hours = $3, semester_id = $4, university_id = $5 WHERE id = $6';
    const values = [course_id, course_name, credit_hours, semester_id, university_id, id];
    await pool.query(query, values);
    res.json({ message: 'Data updated successfully'});
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'An error occurred while updating course' });
  }
});

// Get all program
app.get('/program', async (req, res) => {
  try {
    const query = 'SELECT * FROM program';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching program' });
  }
});

// Insert into program table
app.post('/program', async (req, res) => {
  const { program_id, course_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO program (program_id, course_id, university_id) VALUES ($1, $2, $3)', [program_id, course_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific program by ID
app.put('/program/:id', async (req, res) => {
  const { id } = req.params;
  const { program_id, course_id, university_id } = req.body;

  try {
    await pool.query('UPDATE program SET program_id = $1, course_id = $2, university_id = $3 WHERE id = $4', [program_id, course_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating program:', error);
    res.status(500).json({ error: 'An error occurred while updating program' });
  }
});

// Get all department
app.get('/department', async (req, res) => {
  try {
    const query = 'SELECT * FROM department';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching department' });
  }
});

// Insert into department table
app.post('/department', async (req, res) => {
  const { department_id, program_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO department (department_id, program_id, university_id) VALUES ($1, $2, $3)', [department_id, program_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific department by ID
app.put('/department/:id', async (req, res) => {
  const { id } = req.params;
  const { department_id, program_id, university_id } = req.body;

  try {
    await pool.query('UPDATE department SET department_id = $1, program_id = $2, university_id = $3 WHERE id = $4', [department_id, program_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ error: 'An error occurred while updating department' });
  }
});

// Get all faculty
app.get('/faculty', async (req, res) => {
  try {
    const query = 'SELECT * FROM faculty';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching faculty' });
  }
});

// Insert into faculty table
app.post('/faculty', async (req, res) => {
  const { faculty_id, department_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO faculty (faculty_id, department_id, university_id) VALUES ($1, $2, $3)', [faculty_id, department_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific faculty by ID
app.put('/faculty/:id', async (req, res) => {
  const { id } = req.params;
  const { faculty_id, department_id, university_id } = req.body;

  try {
    await pool.query('UPDATE faculty SET faculty_id = $1, department_id = $2, university_id = $3 WHERE id = $4', [faculty_id, department_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ error: 'An error occurred while updating faculty' });
  }
});

// Get all academic record for student
app.get('/sacademic_record', async (req, res) => {
  try {
    const query = 'SELECT * FROM sacademic_record';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching student academic record' });
  }
});

// Insert into student academic record table
app.post('/sacademic_record', async (req, res) => {
  const { sacademic_id, student_id, faculty_id, department_id, program_id, course_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO sacademic_record (sacademic_id, student_id, faculty_id, department_id, program_id, course_id, university_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [sacademic_id, student_id, faculty_id, department_id, program_id, course_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific student academic record by ID
app.put('/sacademic_record/:id', async (req, res) => {
  const { id } = req.params;
  const { sacademic_id, student_id, faculty_id, department_id, program_id, course_id, university_id } = req.body;

  try {
    await pool.query('UPDATE sacademic_record SET sacademic_id = $1, student_id = $2, faculty_id = $3, department_id = $4, program_id = $5, course_id = $6, university_id = $7 WHERE id = $8', [sacademic_id, student_id, faculty_id, department_id, program_id, course_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating student academic record:', error);
    res.status(500).json({ error: 'An error occurred while updating student academic record' });
  }
});

// Get all academic record for lecturer
app.get('/lacademic_record', async (req, res) => {
  try {
    const query = 'SELECT * FROM lacademic_record';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching lecturer academic record' });
  }
});

// Insert into lecturer academic record table
app.post('/lacademic_record', async (req, res) => {
  const { lacademic_id, lecturer_id, faculty_id, department_id, course_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO lacademic_record (lacademic_id, lecturer_id, faculty_id, department_id, course_id, university_id) VALUES ($1, $2, $3, $4, $5, $6)', [lacademic_id, lecturer_id, faculty_id, department_id, course_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific lecturer academic record by ID
app.put('/lacademic_record/:id', async (req, res) => {
  const { id } = req.params;
  const { lacademic_id, lecturer_id, faculty_id, department_id, course_id, university_id } = req.body;

  try {
    await pool.query('UPDATE lacademic_record SET lacademic_id = $1, lecturer_id = $2, faculty_id = $3, department_id = $4, course_id = $5, university_id = $6 WHERE id = $7', [lacademic_id, lecturer_id, faculty_id, department_id, course_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating lecturer academic record:', error);
    res.status(500).json({ error: 'An error occurred while updating lecturer academic record' });
  }
});

// Get all result
app.get('/result', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM result');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving result:', error);
    res.status(500).json({ error: 'An error occurred while retrieving result' });
  }
});

// Insert into result table
app.post('/result', async (req, res) => {
  const { result_id, academic_id, student_id, university_id, course_id, grade, lecture_comment, lecturer_id } = req.body;

  try {
    await pool.query('INSERT INTO result (result_id, academic_id, student_id, university_id, course_id, grade, lecture_comment, lecturer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [result_id, academic_id, student_id, university_id, course_id, grade, lecture_comment, lecturer_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific result by ID
app.put('/result/:id', async (req, res) => {
  const { id } = req.params;
  const {result_id, academic_id, student_id, university_id, course_id, grade, lecture_comment, lecturer_id } = req.body;

  try {
    await pool.query('UPDATE result SET result_id = $1, academic_id = $2, student_id = $3, university_id = $4, course_id = $5, grade = $6, lecture_comment = $7, lecturer_id = $8 WHERE id = $8', [result_id, academic_id, student_id, university_id, course_id, grade, lecture_comment, lecturer_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'An error occurred while updating result' });
  }
});

// Get all result report
app.get('/result_report', async (req, res) => {
  try {
    const query = 'SELECT * FROM result_report';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching result report' });
  }
});

// Insert into result_report table
app.post('/result_report', async (req, res) => {
  const { result_report_id, result_report_name, result_report_date, pass_rate, fail_rate, explanation, university_id } = req.body;

  try {
    await pool.query('INSERT INTO result_report (result_report_id, result_report_name, result_report_date, pass_rate, fail_rate, explanation, university_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [result_report_id, result_report_name, result_report_date, pass_rate, fail_rate, explanation, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific result report by ID
app.put('/result_report/:id', async (req, res) => {
  const { id } = req.params;
  const { result_report_id, result_report_name, result_report_date, pass_rate, fail_rate, explanation, university_id } = req.body;

  try {
    await pool.query('UPDATE result_report SET result_report_id = $1, result_report_name = $2, result_report_date = $3, pass_rate = $4, fail_rate = $5, explanation = $6, university_id = $7 WHERE id = $8', [result_report_id, result_report_name, result_report_date, pass_rate, fail_rate, explanation, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating result_report:', error);
    res.status(500).json({ error: 'An error occurred while updating result_report' });
  }
});

// Get all budgets report
app.get('/budgets_report', async (req, res) => {
  try {
    const query = 'SELECT * FROM budgets_report';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching budgets report' });
  }
});

// Insert into Budgets_report table
app.post('/budgets_report', async (req, res) => {
  const { budgets_report_id, budget_report_name, budget_report_date, initial_amount, used_amount, balance, explanation } = req.body;

  try {
    await pool.query('INSERT INTO Budgets_report (budgets_report_id, budget_report_name, budget_report_date, initial_amount, used_amount, balance, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7)', [budgets_report_id, budget_report_name, budget_report_date, initial_amount, used_amount, balance, explanation]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific budget report by ID
app.put('/budgets_report/:id', async (req, res) => {
  const { id } = req.params;
  const { budgets_report_id, budget_report_name, budget_report_date, initial_amount, used_amount, balance, explanation } = req.body;

  try {
    await pool.query('UPDATE Budgets_report SET budgets_report_id = $1, budget_report_name = $2, budget_report_date = $3, initial_amount = $4, used_amount = $5, balance = $6, explanation = $7 WHERE id = $8', [budgets_report_id, budget_report_name, budget_report_date, initial_amount, used_amount, balance, explanation, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating budget report:', error);
    res.status(500).json({ error: 'An error occurred while updating budget report' });
  }
});

// Get all facilities report
app.get('/facilities_report', async (req, res) => {
  try {
    const query = 'SELECT * FROM facilities_report';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching facilities report' });
  }
});

// Insert into Facilities_report table
app.post('/facilities_report', async (req, res) => {
  const { facilities_report_id, facilities_report_name, facilities_report_date, explanation } = req.body;

  try {
    await pool.query('INSERT INTO Facilities_report (facilities_report_id, facilities_report_name, facilities_report_date, explanation) VALUES ($1, $2, $3, $4)', [facilities_report_id, facilities_report_name, facilities_report_date, explanation]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific facilities report by ID
app.put('/facilities_report/:id', async (req, res) => {
  const { id } = req.params;
  const { facilities_report_id, facilities_report_name, facilities_report_date, explanation } = req.body;

  try {
    await pool.query('UPDATE Facilities_report SET facilities_report_id = $1, facilities_report_name = $2, facilities_report_date = $3, explanation = $4 WHERE id = $5', [facilities_report_id, facilities_report_name, facilities_report_date, explanation, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating facilities report:', error);
    res.status(500).json({ error: 'An error occurred while updating facilities report' });
  }
});

// Final_report table endpoint
app.get('/final_report', async (req, res) => {
  try {
    const query = 'SELECT * FROM final_report';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching library information' });
  }
});

// Insert into Final_report table
app.post('/final_report', async (req, res) => {
  const { final_report_id, facilities_report_id, budgets_report_id, result_report_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO Final_report (final_report_id, facilities_report_id, budgets_report_id, result_report_id, university_id) VALUES ($1, $2, $3, $4, $5)', [final_report_id, facilities_report_id, budgets_report_id, result_report_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific final report by ID
app.put('/final_report/:id', async (req, res) => {
  const { id } = req.params;
  const { final_report_id, facilities_report_id, budgets_report_id, result_report_id, university_id } = req.body;

  try {
    await pool.query('UPDATE Final_report SET final_report_id = $1, facilities_report_id = $2, budgets_report_id = $3, result_report_id = $4, university_id = $5 WHERE id = $6', [final_report_id, facilities_report_id, budgets_report_id, result_report_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating final report:', error);
    res.status(500).json({ error: 'An error occurred while updating final report' });
  }
});

// library table endpoint
app.get('/library',async (req, res) => {
  try {
    const query = 'SELECT * FROM library';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching library' });
  }
});

//insert into library table
app.post('/library', async (req, res) => {
  const { library_id, library_name, university_id, catalog, usage_statistics, library_events, library_policies } = req.body;

  try {
    await pool.query('INSERT INTO library (library_id, library_name, university_id, catalog, usage_statistics, library_events, library_policies) VALUES ($1, $2, $3, $4, $5, $6, $7)', [library_id, library_name, university_id, catalog, usage_statistics, library_events, library_policies]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific library by ID
app.put('/library/:id', async (req, res) => {
  const { id } = req.params;
  const { library_id, library_name, university_id, catalog, usage_statistics, library_events, library_policies } = req.body;

  try {
    await pool.query('UPDATE library SET library_id = $1, library_name = $2, university_id = $3, catalog = $4, usage_statistics = $5, library_events = $6, library_policies = $7 WHERE id = $8', [library_id, library_name, university_id, catalog, usage_statistics, library_events, library_policies, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating library:', error);
    res.status(500).json({ error: 'An error occurred while updating library' });
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

//insert into library_information table
app.post('/library_information', async (req, res) => {
  const { library_information_id, student_id, lecturer_id, university_id, books_borrowed, books_returned, dates, library_id } = req.body;

  try {
    await pool.query('INSERT INTO library_information (library_information_id, student_id, lecturer_id, university_id, books_borrowed, books_returned, dates, library_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [library_information_id, student_id, lecturer_id, university_id, books_borrowed, books_returned, dates, library_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific library information by ID
app.put('/library_information/:id', async (req, res) => {
  const { id } = req.params;
  const { library_information_id, student_id, lecturer_id, university_id, books_borrowed, books_returned, dates, library_id } = req.body;

  try {
    await pool.query('UPDATE library_information SET library_information_id = $1, student_id = $2, lecturer_id = $3, university_id = $4, books_borrowed = $5, books_returned = $6, dates = $7, library_id = $8 WHERE id = $9', [library_information_id, student_id, lecturer_id, university_id, books_borrowed, books_returned, dates, library_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating library information:', error);
    res.status(500).json({ error: 'An error occurred while updating library information' });
  }
});

// Get all funding record
app.get('/funding', async (req, res) => {
  try {
    const query = 'SELECT * FROM funding';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching funding record' });
  }
});

//insert into funding table
app.post('/funding', async (req, res) => {
  const { funding_id, student_id, university_id, funding_name, fund_purpose, funding_duration, funding_status, funding_details } = req.body;

  try {
    await pool.query('INSERT INTO Funding (funding_id, student_id, university_id, funding_name, fund_purpose, funding_duration, funding_status, funding_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [funding_id, student_id, university_id, funding_name, fund_purpose, funding_duration, funding_status, funding_details]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific funding record by ID
app.put('/funding/:id', async (req, res) => {
  const { id } = req.params;
  const { funding_id, student_id, university_id, funding_name, fund_purpose, funding_duration, funding_status, funding_details } = req.body;

  try {
    await pool.query('UPDATE Funding SET funding_id = $1, student_id = $2, university_id = $3, funding_name = $4, fund_purpose = $5, funding_duration = $6, funding_status = $7, funding_details = $8 WHERE id = $9', [funding_id, student_id, university_id, funding_name, fund_purpose, funding_duration, funding_status, funding_details, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating funding record:', error);
    res.status(500).json({ error: 'An error occurred while updating funding record' });
  }
});

// Get all project
app.get('/project', async (req, res) => {
  try {
    const query = 'SELECT * FROM project';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching project' });
  }
});

//insert into project table
app.post('/project', async (req, res) => {
  const { project_id, project_name, project_description, university_id } = req.body;

  try {
    await pool.query('INSERT INTO project (project_id, project_name, project_description, university_id) VALUES ($1, $2, $3, $4)', [project_id, project_name, project_description, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific project by ID
app.put('/project/:id', async (req, res) => {
  const { id } = req.params;
  const { project_id, project_name, project_description, university_id } = req.body;

  try {
    await pool.query('UPDATE project SET project_id = $1, project_name = $2, project_description = $3, university_id = $4 WHERE id = $5', [project_id, project_name, project_description, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'An error occurred while updating project' });
  }
});

// Get all fproject
app.get('/fproject', async (req, res) => {
  try {
    const query = 'SELECT * FROM fproject';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching fproject' });
  }
});

// Insert into fproject table
app.post('/fproject', async (req, res) => {
  const { fproject_id, project_id, student_id, lecturer_id, university_id } = req.body;

  try {
    await pool.query('INSERT INTO fproject (fproject_id, project_id, student_id, lecturer_id, university_id) VALUES ($1, $2, $3, $4, $5)', [fproject_id, project_id, student_id, lecturer_id, university_id]);

    res.json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred while inserting data' });
  }
});

// Update data for a specific fproject by ID
app.put('/fproject/:id', async (req, res) => {
  const { id } = req.params;
  const { fproject_id, project_id, student_id, lecturer_id, university_id } = req.body;

  try {
    await pool.query('UPDATE fproject SET fproject_id = $1, project_id = $2, student_id = $3, lecturer_id = $4, university_id = $5 WHERE id = $6', [fproject_id, project_id, student_id, lecturer_id, university_id, id]);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error updating fproject:', error);
    res.status(500).json({ error: 'An error occurred while updating fproject' });
  }
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
  console.log(`LIPAM server running on port ${port}`);
});
