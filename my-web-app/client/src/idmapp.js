//Idmapp.js
import React, { Component } from 'react';
import logo from './logo.svg';
import './IdmApp.css';

class IdmApp extends Component {
  state = {
    tables: [],
    data: [],
    selectedTable: null,
    loading: false,
  };

  componentDidMount() {
    this.fetchTables();
  }

  fetchTables = () => {
    fetch('http://localhost:3007/tables')
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
    fetch(`http://localhost:3007/${table}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data, loading: false });
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
        window.alert('Invalid table selection');
        return;
    }

    // Only allow insert operation if the university name is IDM
    if (newData.university_name === 'IDM') {
      fetch(`http://localhost:3007/${selectedTable}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })
        .then((response) => response.json())
        .then((data) => {
          window.alert('Insert operation response:', data);
          // After successful insert, fetch the updated table data
          this.fetchTableData(selectedTable);
        })
        .catch((error) => {
          window.alert('Error performing insert operation:', error);
        });
    } else {
      window.alert('University name must be "IDM" for insert operation');
    }
  };

  updateData = () => {
    const { selectedTable, data } = this.state;
    const updatedData = {};

    switch (selectedTable) {
      case 'students':
        const studentIndex = prompt('Enter student ID:');
        if (studentIndex >= 0 && studentIndex < data.length) {
          const student = data[studentIndex];
          updatedData.student_id = student.student_id;
          updatedData.university_name = prompt('Enter new university name:', student.university_name);
          updatedData.arrival_year = prompt('Enter new arrival year:', student.arrival_year);
          updatedData.completion_year = prompt('Enter new completion year:', student.completion_year);
          updatedData.year_of_study = prompt('Enter new year of study:', student.year_of_study);
        } else {
          window.alert('Invalid student ID');
          return;
        }
        break;
      case 'lecturers':
        const lecturerIndex = prompt('Enter lecturer ID:');
        if (lecturerIndex >= 0 && lecturerIndex < data.length) {
          const lecturer = data[lecturerIndex];
          updatedData.lecturer_id = lecturer.lecturer_id;
          updatedData.university_name = prompt('Enter new university name:', lecturer.university_name);
          updatedData.arrival_year = prompt('Enter new arrival year:', lecturer.arrival_year);
        } else {
          window.alert('Invalid lecturer ID');
          return;
        }
        break;
      case 'students/personal-info':
        const spersonalInfoIndex = prompt("Enter student's personal info ID:");
        if (spersonalInfoIndex >= 0 && spersonalInfoIndex < data.length) {
          const spersonalInfo = data[spersonalInfoIndex];
          updatedData.spersonal_info_id = spersonalInfo.spersonal_info_id;
          updatedData.student_id = prompt('Enter new student ID:', spersonalInfo.student_id);
          updatedData.first_name = prompt('Enter new first name:', spersonalInfo.first_name);
          updatedData.middle_name = prompt('Enter new middle name:', spersonalInfo.middle_name);
          updatedData.last_name = prompt('Enter new last name:', spersonalInfo.last_name);
          updatedData.id_number = prompt('Enter new ID number:', spersonalInfo.id_number);
          updatedData.district = prompt('Enter new district:', spersonalInfo.district);
          updatedData.contact = prompt('Enter new contact:', spersonalInfo.contact);
          updatedData.university_name = prompt(
            'Enter new university name:',
            spersonalInfo.university_name
          );
        } else {
          window.alert('Invalid student personal info ID');
          return;
        }
        break;
      case 'lecturers/personal-info':
        const lpersonalInfoIndex = prompt("Enter lecturer's personal info ID:");
        if (lpersonalInfoIndex >= 0 && lpersonalInfoIndex < data.length) {
          const lpersonalInfo = data[lpersonalInfoIndex];
          updatedData.lpersonal_info_id = lpersonalInfo.lpersonal_info_id;
          updatedData.lecturer_id = prompt('Enter new lecturer ID:', lpersonalInfo.lecturer_id);
          updatedData.first_name = prompt('Enter new first name:', lpersonalInfo.first_name);
          updatedData.middle_name = prompt('Enter new middle name:', lpersonalInfo.middle_name);
          updatedData.last_name = prompt('Enter new last name:', lpersonalInfo.last_name);
          updatedData.id_number = prompt('Enter new ID number:', lpersonalInfo.id_number);
          updatedData.district = prompt('Enter new district:', lpersonalInfo.district);
          updatedData.contact = prompt('Enter new contact:', lpersonalInfo.contact);
          updatedData.university_name = prompt(
            'Enter new university name:',
            lpersonalInfo.university_name
          );
        } else {
          window.alert('Invalid lecturer personal info ID');
          return;
        }
        break;
      default:
        window.alert('Invalid table selection');
        return;
    }

    fetch(`http://localhost:3007/${selectedTable}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.alert('Update operation response:', data);
        // After successful update, fetch the updated table data
        this.fetchTableData(selectedTable);
      })
      .catch((error) => {
        window.alert('Error performing update operation:', error);
      });
  };

  deleteData = () => {
  const { selectedTable, data } = this.state;
  const deleteIndex = prompt('Enter ID of the data to delete:');

  if (deleteIndex >= 0 && deleteIndex < data.length) {
    const deleteData = data[deleteIndex];

    fetch(`http://localhost:3007/${selectedTable}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deleteData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.alert('Delete operation response:', data);
        // After successful delete, fetch the updated table data
        this.fetchTableData(selectedTable);
      })
      .catch((error) => {
        window.alert('Error performing delete operation:', error);
      });
  } else {
    window.alert('Invalid index for delete operation');
  }
};

  render() {
    const { selectedTable, tables, data, loading } = this.state;
  
    const handleLogout = () => {
      // Perform logout logic here
      // For example, clear any authentication token or session data
  
      // Redirect back to App.js or any desired page
      window.location.href = '/'; // Assuming App.js is the root page
    };

    const filteredData = data.filter((row) => row.university_name === 'Idm');
  
    return (
      <div className="App">
        <div className="IdmApp-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>IDM Database Management System</h1>
          <div className="container">
            <div className="table-list">
            {selectedTable && (
            <div className="selected-table">
              <h2>{selectedTable}</h2>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : filteredData.length > 0 ? (
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
              <div>
                <h2>Other Tables</h2>
                {tables.map((table) => (
                  <div
                    key={table}
                    className={`table-item ${selectedTable === table ? 'active' : ''}`}
                    onClick={() => this.selectTable(table)}
                  >
                    {table}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="actions">
            <button onClick={this.fetchTables}>Refresh Tables</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    );
  }
}  
export default IdmApp;
