//CODE 100% ORIGINAL BY HIVEMIND GROUP
//FOR FURTHER COMMUNICATION OR IF HAVING QUESTIONS REGARDING THE FUNCTIONS,
//PLEASE CONTACT +26650709108 OR EMAIL US AT edwardletsapo@gmail.com

//MOETAPP.JS CODE
import React, { Component } from 'react';
import logo from './logo.svg';
import './MoetApp.css';

class MoetApp extends Component {
  state = {
    tables: [],
    data: [],
    selectedTable: null,
    loading: false,
    filter: '',
    showTables: false,
  };

  componentDidMount() {
    this.fetchTables();
  }

  fetchTables = () => {
    const { filter } = this.state;
    let url = 'http://localhost:3009/tables';
  
    if (filter) {
      url += `?filter=${filter}`;
    }
  
    fetch(url)
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
    const { filter } = this.state;
    let url = `http://localhost:3009/${table}`;
  
    if (filter) {
      url += `?filter=${filter}`;
    }
  
    this.setState({ loading: true });
    fetch(url)
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

  handleShowTables = () => {
    this.setState({ showTables: true });
  };

  handleHideTables = () => {
    this.setState({ showTables: false });
  };

  handleFilterChange = (event) => {
    const filter = event.target.value;
    this.setState({ filter });
  };
  

  render() {
    const {
      selectedTable,
      tables,
      data,
      loading,
      filter,
      showTables,
    } = this.state;

    const handleLogout = () => {
      // Perform logout logic here
      // For example, clear any authentication token or session data

      // Redirect back to App.js or any desired page
      window.location.href = '/'; // Assuming App.js is the root page
    };

    return (
      <div className="App">
        <div className="MoetApp-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Welcome Minister. Below is Lesotho's HLIs' Data...</h1>
          <div className="more-actions">
            {/* Filter dropdown */}
            <select value={filter} onChange={this.handleFilterChange} style={{ fontSize: '13px', padding: '7px 7px', marginRight: '207px' }}>
              <option value="">Filter Tables By:</option> {/* Show all results */}
              <option value="NUL">NUL</option>
              <option value="LP">LP</option>
              <option value="LIPAM">LIPAM</option>
              <option value="IDM">IDM</option>
              <option value="CAS">CAS</option>
              <option value="LEC">LEC</option>
              <option value="LAC">LAC</option>
            </select>
            <button
              onClick={this.fetchTables}
              style={{ fontSize: '13px', padding: '7px 7px', marginRight: '94px' }}
            >
              Refresh Tables
            </button>
            <button onClick={handleLogout} style={{fontSize: '13px',padding: '7px 7px', marginRight: '140px'}}>Logout</button>
          <div className="table-list">
            <div className="toggle-tables" style={{ marginTop: '20px' }}>
              {!showTables ? (
                <button onClick={this.handleShowTables} style={{fontSize: '13px',padding: '7px 7px'}}>Show Tables</button>
              ) : (
                <button onClick={this.handleHideTables} style={{fontSize: '13px',padding: '7px 7px'}}>Hide Tables</button>
              )}
            </div>
            </div>
            {showTables && (
                <ul>
                  {tables
                    .filter((table) => table !== "pg_dist_object") 
                    .map((table) => (
                      <li key={table} onClick={() => this.selectTable(table)}>
                        {table}
                        {selectedTable === table && (
                          <div className="selected-table">
                            {loading ? (
                              <div className="loading">Loading...</div>
                            ) : data.length > 0 ? (
                              <table>
                                <thead>
                                  <tr>
                                    {Object.keys(data[0]).map((key) => (
                                      <th key={key}>{key}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.map((row, index) => (
                                    <tr key={index}>
                                      {Object.values(row).map((value, index) => (
                                        <td key={index}>{value}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div className="no-data">
                                No data available in this table
                              </div>
                            )}
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

export default MoetApp;
