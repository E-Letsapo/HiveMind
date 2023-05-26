import React, { Component } from 'react';
import logo from './logo.svg';
import './MoetApp.css';

class MoetApp extends Component {
  state = {
    tables: [],
    data: [],
    selectedTable: null,
    loading: false,
    searchResults: [],
    searchId: '',
    showResults: false,
    filter: '',
  };

  componentDidMount() {
    this.fetchTables();
  }

  fetchTables = () => {
    fetch('http://localhost:3009/tables')
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
    fetch(`http://localhost:3009/${table}`)
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

  handleSearchChange = (event) => {
    this.setState({ searchId: event.target.value });
  };

  handleSearchSubmit = () => {
    const { data, searchId, filter } = this.state;

    if (data) {
      const filteredData = data.filter(
        (row) =>
          row.id === searchId && (filter === '' || row.universityName === filter)
      );
      this.setState({ searchResults: filteredData, showResults: true });
    }
  };

  handleHideResults = () => {
    this.setState({ showResults: false });
  };

  handleShowResults = () => {
    this.setState({ showResults: true });
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  render() {
    const {
      selectedTable,
      tables,
      data,
      loading,
      searchResults,
      searchId,
      showResults,
      filter,
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
          <h1>ALL HLIs Database Management System</h1>
          <div className="search-container">
            {/* Filter dropdown */}
            <select value={filter} onChange={this.handleFilterChange}>
              <option value="">All</option> {/* Show all results */}
              <option value="NUL">NUL</option>
              <option value="LP">LP</option>
              <option value="LIPAM">LIPAM</option>
              <option value="IDM">IDM</option>
              <option value="CAS">CAS</option>
              <option value="LEC">LEC</option>
              <option value="LAC">LAC</option>
            </select>
            <input
              type="text"
              value={searchId}
              onChange={this.handleSearchChange}
              placeholder="Search by ID"
            />
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
            <ul>
              {tables.map((table) => (
                <li key={table} onClick={() => this.selectTable(table)}>
                  {table}
                  {selectedTable === table && (
                    <div className="selected-table">
                      <h2>{selectedTable}</h2>
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
          </div>
        </div>
      </div>
    );
  }
}

export default MoetApp;
