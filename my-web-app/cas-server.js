const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3003;

// Enable CORS for requests from localhost:3000 to localhost:3009
const allowedOrigins = [
  'http://localhost:3000'
];

app.use(cors({
  origin: allowedOrigins
}));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('CAS DBMs hello!!');
});

// Additional routes and functionality specific to the "NUL" worker node can be added here

// Route handler for "/tables"
app.get('/tables', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/tables',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      const tables = JSON.parse(data);
      res.json(tables);
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching tables:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// University table endpoint
app.get('/university', (req, res) => {
  // Implement code to fetch data from the University table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/university',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching University table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Students table endpoint
app.get('/students', (req, res) => {
  // Implement code to fetch data from the Students table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/students',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Students table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Lecturers table endpoint
app.get('/lecturers', (req, res) => {
  // Implement code to fetch data from the Lecturers table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/lecturers',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Lecturers table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// SPersonal_info table endpoint
app.get('/spersonal_info', (req, res) => {
  // Implement code to fetch data from the SPersonal_info table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/spersonal_info',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching SPersonal_info table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// LPersonal_info table endpoint
app.get('/lpersonal_info', (req, res) => {
  // Implement code to fetch data from the LPersonal_info table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/lpersonal_info',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching LPersonal_info table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// SAcademic_records table endpoint
app.get('/sacademic_records', (req, res) => {
  // Implement code to fetch data from the SAcademic_records table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/sacademic_records',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching SAcademic_records table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// LAcademic_records table endpoint
app.get('/lacademic_records', (req, res) => {
  // Implement code to fetch data from the LAcademic_records table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/lacademic_records',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching LAcademic_records table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// SCourses table endpoint
app.get('/scourses', (req, res) => {
  // Implement code to fetch data from the SCourses table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/scourses',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching SCourses table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// LCourses table endpoint
app.get('/lcourses', (req, res) => {
  // Implement code to fetch data from the LCourses table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/lcourses',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching LCourses table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// SPrograms table endpoint
app.get('/sprograms', (req, res) => {
  // Implement code to fetch data from the SPrograms table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/sprograms',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching SPrograms table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// LPrograms table endpoint
app.get('/lprograms', (req, res) => {
  // Implement code to fetch data from the LPrograms table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/lprograms',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching LPrograms table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Departments table endpoint
app.get('/departments', (req, res) => {
  // Implement code to fetch data from the Departments table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/departments',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Departments table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Faculties table endpoint
app.get('/faculties', (req, res) => {
  // Implement code to fetch data from the Faculties table in the database
  // Retrieve the data and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/faculties',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Faculties table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});
// Results table endpoint
app.get('/results', (req, res) => {
  // Retrieve data from the Results table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/results',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Results table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Semesters table endpoint
app.get('/semesters', (req, res) => {
  // Retrieve data from the Semesters table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/semesters',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Semesters table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Results_reports table endpoint
app.get('/results_reports', (req, res) => {
  // Retrieve data from the Results_reports table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/results_reports',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Results_reports table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Budgets_reports table endpoint
app.get('/budgets_reports', (req, res) => {
  // Retrieve data from the Budgets_reports table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/budgets_reports',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Budgets_reports table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Facilities_reports table endpoint
app.get('/facilities_reports', (req, res) => {
  // Retrieve data from the Facilities_reports table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/facilities_reports',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Facilities_reports table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Final_reports table endpoint
app.get('/final_reports', (req, res) => {
  // Retrieve data from the Final_reports table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/final_reports',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Final_reports table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// MOET table endpoint
app.get('/moet', (req, res) => {
  // Retrieve data from the MOET table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/moet',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching MOET table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Library table endpoint
app.get('/library', (req, res) => {
  // Retrieve data from the Library table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/library',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Library table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Library_information table endpoint
app.get('/library_information', (req, res) => {
  // Retrieve data from the Library_information table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/library_information',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Library_information table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Funding table endpoint
app.get('/funding', (req, res) => {
  // Retrieve data from the Funding table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/funding',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Funding table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Projects table endpoint
app.get('/projects', (req, res) => {
  // Retrieve data from the Projects table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/projects',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching Projects table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// FProjects table endpoint
app.get('/fprojects', (req, res) => {
  // Retrieve data from the FProjects table and send the response
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/fprojects',
    method: 'GET'
  };

  const request = http.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching FProjects table data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  request.end();
});

// Start the server
app.listen(port, () => {
  console.log(`CAS server running on port ${port}`);
});
