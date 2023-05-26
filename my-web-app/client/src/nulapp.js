//nulapp.js
import React, { Component } from 'react';
import logo from './logo.svg';
import './NulApp.css';

class NulApp extends Component {
  state = {
    tables: [],
    data: null,
    selectedTable: null,
    loading: false,
    searchId: '', // New state for search ID
    searchResults: [], // New state for search results
    showTables: false,
  };

  componentDidMount() {
    this.fetchTables();
  }

  fetchTables = () => {
    fetch('http://localhost:3002/tables')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState({ tables: data });

          const { selectedTable } = this.state;
          if (selectedTable) {
            this.fetchTableData(selectedTable);
          }
        } else {
          window.alert('Invalid response data:', data);
        }
      })
      .catch((error) => {
        window.alert('Error fetching tables:', error);
      });
  };

  fetchTableData = (table) => {
    this.setState({ loading: true });
    fetch(`http://localhost:3002/${table}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          this.setState({ data, loading: false });
        } else if (data.results && Array.isArray(data.results)) {
          this.setState({ data: data.results, loading: false });
        } else {
          window.alert('Invalid response data:', data);
          this.setState({ data: [], loading: false });
        }
      })
      .catch((error) => {
        window.alert('Error fetching table data:', error);
        this.setState({ data: [], loading: false });
      });
  };

  selectTable = (table) => {
    this.setState({ selectedTable: table });
    this.fetchTableData(table);
  };

  insertData = () => {
    const { selectedTable } = this.state;
    const newData = {};

    switch (selectedTable) {
      case 'students':
        newData.student_id = prompt('Enter student ID:');
        newData.university_name = prompt('Enter university name:');
        newData.arrival_year = prompt('Enter arrival year:');
        newData.completion_year = prompt('Enter completion year:');
        newData.year_of_study = prompt('Enter year of study:');
        break;
      case 'lecturers':
        newData.lecturer_id = prompt('Enter lecturer ID:');
        newData.university_name = prompt('Enter university name:');
        newData.arrival_year = prompt('Enter arrival year:');
        break;
      case 'students/personal-info':
        newData.spersonal_info_id = prompt("Enter student's personal info ID:");
        newData.student_id = prompt('Enter student ID:');
        newData.first_name = prompt('Enter first name:');
        newData.middle_name = prompt('Enter middle name:');
        newData.last_name = prompt('Enter last name:');
        newData.id_number = prompt('Enter ID number:');
        newData.district = prompt('Enter district:');
        newData.contact = prompt('Enter contact:');
        newData.university_name = prompt('Enter university name:');
        break;
      case 'lecturers/personal-info':
        newData.lpersonal_info_id = prompt("Enter lecturer's personal info ID:");
        newData.lecturer_id = prompt('Enter lecturer ID:');
        newData.first_name = prompt('Enter first name:');
        newData.middle_name = prompt('Enter middle name:');
        newData.last_name = prompt('Enter last name:');
        newData.id_number = prompt('Enter ID number:');
        newData.district = prompt('Enter district:');
        newData.contact = prompt('Enter contact:');
        newData.university_name = prompt('Enter university name:');
        break;
      default:
        window.alert('Invalid table selected');
        return;
    }

    // Only allow insert operation if the university name is NUL
    if (newData.university_name === 'NUL') {
      fetch(`http://localhost:3002/${selectedTable}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: newData }), // Wrap newData in an object
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Insert success:', data);
          this.fetchTableData(selectedTable);
        })
        .catch((error) => {
          window.alert('Error performing insert operation:', error);
        });
    } else {
      window.alert('University name must be "NUL" for insert operation');
    }
  }

  updateData = () => {
    const { selectedTable } = this.state;
    const searchId = prompt('Enter the student ID to update:');

    fetch(`http://localhost:3002/${selectedTable}/${searchId}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const student = data[0];

          // Prompt for new data
          const newData = {};

          switch (selectedTable) {
            case 'students':
              newData.student_id = prompt('Enter new student ID:', student.student_id);
              newData.university_name = prompt('Enter new university name:', student.university_name);
              newData.arrival_year = prompt('Enter new arrival year:', student.arrival_year);
              newData.completion_year = prompt('Enter new completion year:', student.completion_year);
              newData.year_of_study = prompt('Enter new year of study:', student.year_of_study);
              break;
            case 'lecturers':
              newData.lecturer_id = prompt('Enter new lecturer ID:', student.lecturer_id);
              newData.university_name = prompt('Enter new university name:', student.university_name);
              newData.arrival_year = prompt('Enter new arrival year:', student.arrival_year);
              break;
            case 'students/personal-info':
              newData.spersonal_info_id = prompt("Enter new student's personal info ID:", student.spersonal_info_id);
              newData.student_id = prompt('Enter new student ID:', student.student_id);
              newData.first_name = prompt('Enter new first name:', student.first_name);
              newData.middle_name = prompt('Enter new middle name:', student.middle_name);
              newData.last_name = prompt('Enter new last name:', student.last_name);
              newData.id_number = prompt('Enter new ID number:', student.id_number);
              newData.district = prompt('Enter new district:', student.district);
              newData.contact = prompt('Enter new contact:', student.contact);
              newData.university_name = prompt('Enter new university name:', student.university_name);
              break;
            case 'lecturers/personal-info':
              newData.lpersonal_info_id = prompt("Enter new lecturer's personal info ID:", student.lpersonal_info_id);
              newData.lecturer_id = prompt('Enter new lecturer ID:', student.lecturer_id);
              newData.first_name = prompt('Enter new first name:', student.first_name);
              newData.middle_name = prompt('Enter new middle name:', student.middle_name);
              newData.last_name = prompt('Enter new last name:', student.last_name);
              newData.id_number = prompt('Enter new ID number:', student.id_number);
              newData.district = prompt('Enter new district:', student.district);
              newData.contact = prompt('Enter new contact:', student.contact);
              newData.university_name = prompt('Enter new university name:', student.university_name);
              break;
            default:
              window.alert('Invalid table selected');
              return;
          }

          fetch(`http://localhost:3002/${selectedTable}/${student.student_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Update success:', data);
              this.fetchTableData(selectedTable);
            })
            .catch((error) => {
              window.alert('Error performing update operation:', error);
            });
        } else {
          window.alert('No matching student found');
        }
      })
      .catch((error) => {
        window.alert('Error fetching student data:', error);
      });
  };

  deleteData = () => {
    const { selectedTable } = this.state;
    const searchId = prompt('Enter the ID of the record to delete:');
  
    if (!searchId) {
      // User canceled or didn't provide an ID
      return;
    }
  
    fetch(`http://localhost:3002/${selectedTable}/${searchId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Delete operation failed');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Delete success:', data);
        this.fetchTableData(selectedTable);
      })
      .catch((error) => {
        window.alert('An error occurred while deleting the record.', error);
      });
  };    

handleSearchChange = (event) => {
  this.setState({ searchId: event.target.value });
};

handleSearchSubmit = () => {
  const { data, searchId } = this.state;

  if (data) { // Add a null check for the data object
    const searchResults = data.filter((row) => row.id === searchId);
    this.setState({ searchResults });
  }
};

handleHideResults = () => {
  this.setState({ showResults: false });
};

handleShowResults = () => {
  this.setState({ showResults: true });
};


render() {
  const { selectedTable, tables, data, loading, searchResults, searchId, showResults, showTables } = this.state;

  const handleLogout = () => {
    // Perform logout logic here
    // For example, clear any authentication token or session data

    // Redirect back to App.js or any desired page
    window.location.href = '/'; // Assuming App.js is the root page
  };

  const filteredData = data && data.filter((row) => row.university_name === 'NUL'); // Add null check

  const handleShowTables = () => {
    this.setState({ showTables: true });
  };

  const handleHideTables = () => {
    this.setState({ showTables: false });
  };

  return (
    <div className="App">
      <div className="NulApp-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>NUL Database Management System</h1>
        <div className="search-container">
          <input type="text" value={searchId} onChange={this.handleSearchChange} placeholder="Search by ID" />
          <button onClick={this.handleSearchSubmit}>Search</button>
        </div>
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Search Results</h2>
            <table>
              <thead>
                <tr>
                  {Object.keys(searchResults[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {searchResults.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, index) => (
                      <td key={index}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showResults && searchResults.length === 0 && (
          <div className="search-results">
            <p>No matching data found.</p>
          </div>
        )}
        {!showResults && (
          <div className="show-results-button">
            <button onClick={this.handleShowResults}>Show Results</button>
          </div>
        )}
        {showResults && (
          <div className="hide-results-button">
            <button onClick={this.handleHideResults}>Hide Results</button>
          </div>
        )}
        <div className="more-actions">
          <button onClick={this.fetchTables}>Refresh Tables</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="table-list">
          <div className="toggle-tables">
            {!showTables ? (
              <button onClick={handleShowTables}>Show Tables</button>
            ) : (
              <button onClick={handleHideTables}>Hide Tables</button>
            )}
          </div>
          {showTables && (
            <ul>
              {tables.map((table) => (
                <li key={table} onClick={() => this.selectTable(table)}>
                  {table}
                  {selectedTable === table && (
                    <div className="selected-table">
                      <h2>{selectedTable}</h2>
                      {loading ? (
                        <div className="loading">Loading...</div>
                      ) : filteredData && filteredData.length > 0 ? (
                        <table>
                          <thead>
                            <tr>
                              {Object.keys(filteredData[0]).map((key) => (
                                <th key={key}>{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredData.map((row, index) => (
                              <tr key={index}>
                                {Object.values(row).map((value, index) => (
                                  <td key={index}>{value}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="no-data">No data available in this table</div>
                      )}
                      <div className="table-actions">
                        <button onClick={this.insertData}>Insert Data</button>
                        <button onClick={this.updateData}>Update Data</button>
                        <button onClick={this.deleteData}>Delete Data</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
}
  
export default NulApp;
