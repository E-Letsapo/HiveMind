//CODE 100% ORIGINAL BY HIVEMIND GROUP
//FOR FURTHER COMMUNICATION OR IF HAVING QUESTIONS REGARDING THE FUNCTIONS,
//PLEASE CONTACT +26650709108 OR EMAIL US AT edwardletsapo@gmail.com

//CASAPP.JS CODE
import React, { Component } from 'react';
import logo from './logo.svg';
import './CasApp.css';

//APP COMPONENT
class CasApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTable: '',
      tables: [],
      data: null,
      loading: false,
      searchresult: [],
      searchId: '',
      showresult: false,
      showTables: false,
      insertFormData: {},
      showInsertForm: false,
      error: null, // New error state
    };
  }

  componentDidMount() {
    this.fetchTables();
  }

  //CODE ALLOWING USER EDIT THE SEARCH BAR
  handleSearchChange = (event) => {
    this.setState({ searchId: event.target.value });
  };

  // CODE TO SEND THE ID TO SEARCH DATA FOR
  handleSearchSubmit = () => {
    this.fetchSearchresult();
  };

  //CODE TO HIDE SEARCH RESULTS
  handleHideresult = () => {
    this.setState({ showresult: false });
  };

  //CODE TO SHOW SEARCH RESULTS
  handleShowresult = () => {
    this.setState({ showresult: true });
  };

  //CODE TO CALL THE INSERT FORM WHEN INSERT DATA BUTTON IS CLICKED
  handleInsertData = () => {
    this.setState((prevState) => ({
      showInsertForm: !prevState.showInsertForm,
    }));
  };   
 
  //CODE TO DETECT THE SELECTED TABLE
  selectTable = (table) => {
    this.setState({
      selectedTable: table,
      deleteFormData: {}, // Reset delete form data
    });
    this.fetchData(table);
    this.fetchTableColumns(table);
  };  

  //CODE TO FETCH ALL THE TABLES IN THE DATABASE
  fetchTables = () => {
    // Fetch the list of tables from the server
    fetch('http://localhost:3003/tables')
      .then((response) => response.json())
      .then((tables) => {
      this.setState({ tables }, () => {
        // Fetch data for each table
        tables.forEach((table) => {
          this.fetchData(table);
        });
      });
    })
      .catch((error) => {
        window.alert('Error fetching tables:', error);
      });
  };

  //CODE TO FETCH OR GET DATA FOR ALL TABLES
  fetchData = (table) => {
    this.setState({ loading: true });

    // Fetch data for the selected table from the server
    fetch(`http://localhost:3003/${table}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ data, loading: false });
      })
      .catch((error) => {
        window.alert('Error fetching data:', error);
        this.setState({ loading: false });
      });
  };

  // CODE TO SEARCH FOR DATA RELATED TO A CERTAIN ID IN THE WHOLE DATABASE
  fetchSearchresult = () => {
    const { tables, searchId } = this.state;
    const searchresult = [];

    if (searchId === '') {
      console.log('Please insert an ID');
      return;
    }

    tables.forEach((table) => {
      fetch(`http://localhost:3003/${table}/${searchId}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            searchresult.push({ table, data });
          }
        })
        .catch((error) => {
          window.alert('Error fetching search result:', error);
        });
    });

    this.setState({ searchresult });
  };
  
  //CODE TO GET THE SELECTED TABLE COLUMNS
  fetchTableColumns = (table) => {
    fetch(`http://localhost:3003/${table}/columns`)
      .then((response) => response.json())
      .then((columns) => {
        this.setState((prevState) => ({
          insertFormData: {
            ...prevState.insertFormData,
            ...columns.reduce((obj, column) => {
              obj[column] = '';
              return obj;
            }, {}),
          },
        }));
      })
      .catch((error) => {
        window.alert('Error fetching table columns:', error);
      });
  };  

  //CODE THAT ALLOWS USER TO FILL OR CHANGE VALUES OR DATA IN THE INSERT FORM
  handleFormInputChange = (event) => {
    const { name, value } = event.target;
    const { insertFormData } = this.state;
    this.setState({
      insertFormData: {
        ...insertFormData,
        [name]: value,
      },
    });
  };

  //CODE CALLED AFTER FILLING THE INSERT FORM
  handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const { insertFormData, selectedTable } = this.state;
  
    // Check if university_id is 'CAS'
    if (insertFormData.university_id !== 'CAS' || '') {
      console.log('Please enter the correct university_id: CAS');
      return;
    }
  
    // Send the form data to the server for insertion
    fetch(`http://localhost:3003/${selectedTable}`, {
      method: 'POST',
      body: JSON.stringify(insertFormData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data inserted successfully');
  
        // Update the state with the new data
        this.setState((prevState) => ({
          data: [...prevState.data, data], // assuming the response is the newly inserted data object
          showInsertForm: false, // Hide the insert form after submitting
        }));
      })
      .catch((error) => {
        console.log('Error inserting data:', error);
      });
  }
  
  // CODE TO DELETE DATA FROM THE DATABASE
  deleteData = (table, id) => {
    fetch(`http://localhost:3003/${table}/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Record with ID ${id} deleted successfully from ${table}`);
          // Update the state by removing the deleted record from the data array
          this.setState((prevState) => ({
            data: prevState.data.filter((record) => record.id !== id),
          }));
        } else {
          console.log('Delete request failed:', response.status);
        }
      })
      .catch((error) => {
        console.log('Error deleting data:', error);
      });
  };
  
  // CODE TO PROMPT USER FOR ID AND CALL DELETE METHOD
  deleteDataPrompt = () => {
    const id = prompt('Enter the ID of the record you wish to delete:');
    const { selectedTable } = this.state;
    if (id) {
      this.deleteData(selectedTable, id);
    }
  }; 
  
  //FORM FOR INSERTING INTO THE DATABASE
  renderInsertForm = () => {
    const { selectedTable, insertFormData,  showInsertForm  } = this.state;
    const tableColumns = this.getTableColumns(selectedTable);
  
    if (!showInsertForm) {
      return null; // Don't render the insert form
    }
  
    return (
      <div className="insert-form">
        <h3>Insert Data for {selectedTable}</h3>
        <form onSubmit={this.handleFormSubmit}>
          {tableColumns.map((column) => (
            <div key={column}>
              <label htmlFor={column}>{column}</label>
              <input
                type="text"
                id={column}
                name={column}
                value={insertFormData[column] || ''}
                onChange={this.handleFormInputChange}
              />
            </div>
          ))}
          <button type="submit">Insert Data</button>
        </form>
      </div>
    );
  };
// CODE TO UPDATE DATA IN THE DATABASE
updateData = () => {
  const { selectedTable } = this.state;
  const id = prompt('Enter the ID of the record you want to update:');
  if (!id) {
    return;
  }
  const updateFormData = {};

  const tableColumns = this.getTableColumns(selectedTable);
  tableColumns.forEach((column) => {
    if (column !== 'ID' && column !== 'University') {
      const value = prompt(`Enter the new value for ${column}:`);
      if (value) {
        updateFormData[column] = value;
      }
    }
  });

  fetch(`http://localhost:3003/${selectedTable}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateFormData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Record with ID ${id} updated successfully in ${selectedTable}`);
        // Fetch updated data for the selected table
        this.fetchData(selectedTable);
      } else {
        console.log('Update request failed:', response.status);
      }
    })
    .catch((error) => {
      console.log('Error updating data:', error);
    });
};

  //DYNAMIC RETRIEVAL OF THE SELECTED TABLE
  getTableColumns = (table) => {
    const { data } = this.state;
    if (data && data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  };  
  
  render() {
    const {
      selectedTable,
      tables,
      data,
      loading,
      searchresult,
      searchId,
      showresult,
      showTables,
    } = this.state;

    const handleLogout = () => {
      // Perform logout logic here
      // For example, clear any authentication token or session data

      // Redirect back to App.js or any desired page
      window.location.href = '/'; // Assuming App.js is the root page
    };

    const filteredData =
      data && data.filter((row) => row.university_id === 'CAS'); // Add null check

    const handleShowTables = () => {
      this.setState({ showTables: true });
    };

    const handleHideTables = () => {
      this.setState({ showTables: false });
    };

    return (
      <div className="App">
        <div className="CasApp-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>CAS Database Management System</h1>
          <div className="search-container">
            <input
              type="text"
              value={searchId}
              onChange={this.handleSearchChange}
              placeholder="Search by ID"
            />
            <button onClick={this.handleSearchSubmit}>Search</button>
          </div>
          {searchresult.length > 0 && showresult && (
            <div className="search-result">
              <h2>Search result</h2>
              {searchresult.map((result) => (
                <div key={result.table}>
                  <h3>Table: {result.table}</h3>
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(result.data[0])
                          .filter((key) => key !== 'university_id') // Exclude university_id column
                          .map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.map((row, index) => (
                        <tr key={index}>
                          {Object.entries(row)
                            .filter(([key]) => key !== 'university_id') // Exclude university_id column
                            .map(([key, value], index) => (
                              <td key={index}>{value}</td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {showresult && searchresult.length === 0 && (
            <div className="search-result">
              <p>Please enter ID for the record you want to search.</p>
            </div>
          )}
          {!showresult && (
            <div className="show-result-button" style={{ marginTop: '10px' }}>
              <button onClick={this.handleShowresult}>Show result</button>
            </div>
          )}
          {showresult && (
            <div className="hide-result-button" style={{ marginTop: '10px' }}>
              <button onClick={this.handleHideresult}>Hide result</button>
            </div>
          )}
          <div className="more-actions" style={{ marginTop: '10px' }}>
            <button
              onClick={this.fetchTables}
              style={{ fontSize: '13px', padding: '7px 7px', marginRight: '94px' }}
            >
              Refresh Tables
            </button>
            {!showTables ? (
              <button
                onClick={handleShowTables}
                style={{ fontSize: '13px', padding: '7px 7px', marginRight: '140px' }}
              >
                Show Tables
              </button>
            ) : (
              <button
                onClick={handleHideTables}
                style={{ fontSize: '13px', padding: '7px 7px', marginRight: '140px' }}
              >
                Hide Tables
              </button>
            )}
            <button
              onClick={handleLogout}
              style={{ fontSize: '13px', padding: '7px 7px' }}
            >
              Logout
            </button>
          </div>
          {showTables && (
            <ul>
              {tables
                .filter((table) => table !== 'pg_dist_object')
                .filter((table) => table !== 'university')
                .map((table) => (
                  <li key={table} onClick={() => this.selectTable(table)}>
                    {table}
                    {selectedTable === table && (
                      <div className="selected-table">
                        <div className="table-actions">
                          <button
                            onClick={this.handleInsertData}
                            style={{ fontSize: '13px', padding: '7px 7px', marginRight: '100px' }}
                          >
                            Insert Data
                          </button>
                          {this.renderInsertForm()} {/* Render the insert form */}
                          <button
                          onClick={this.updateData} // Add updateData handler to the update button
                          style={{ fontSize: '13px', padding: '7px 7px', marginRight: '100px' }}
                        >
                          Update Data
                        </button>
                          <button
                            onClick={this.deleteDataPrompt}
                            style={{ fontSize: '13px', padding: '7px 7px' }}
                          >
                            Delete Data
                          </button>
                        </div>
                        {loading ? (
                          <div className="loading">Loading...</div>
                        ) : filteredData && filteredData.length > 0 ? (
                          <table>
                            <thead>
                              <tr>
                                {Object.keys(filteredData[0])
                                  .filter((key) => key !== 'university_id') // Exclude 'university_id' column
                                  .map((key) => (
                                    <th key={key}>{key}</th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filteredData.map((row, index) => (
                                <tr key={index}>
                                  {Object.entries(row)
                                    .filter(([key]) => key !== 'university_id') // Exclude 'university_id' column
                                    .map(([key, value], index) => (
                                      <td key={index}>{value}</td>
                                    ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="no-data"></div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

export default CasApp;
