//CODE 100% ORIGINAL BY HIVEMIND GROUP
//FOR FURTHER COMMUNICATION OR IF HAVING QUESTIONS REGARDING THE FUNCTIONS,
//PLEASE CONTACT +26650709108 OR EMAIL US AT edwardletsapo@gmail.com

//APP.JS CODE

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NulApp from './nulapp'; // Import the NulApp component
import LpApp from './lpapp';
import LecApp from './lecapp';
import LipamApp from './lipamapp';
import IdmApp from './idmapp';
import CasApp from './casapp';
import MoetApp from './moetapp';
import LacApp from './lacapp';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginClicked: false,
      selectedNode: '',
      password: '',
      showPassword: false,
      workerNodes: ['NUL', 'CAS', 'LIPAM', 'LP', 'LEC', 'IDM', 'LAC', 'MOET'],
      error: '',

    };
  }

  handleLoginClick = () => {
    this.setState({ loginClicked: true });
  };

  handleNodeSelect = (node) => {
    this.setState({ selectedNode: node });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { selectedNode, password } = this.state;
  
    try {
      this.setState({ isLoading: true }); // Show progress bar
  
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          workerNode: selectedNode,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Login successful message
        this.setState({ isLoading: false }); // Hide progress bar
        await new Promise((resolve) => setTimeout(resolve, 1000));

       
        // Redirect based on the selected node
        switch (selectedNode) {
          case 'NUL':
            this.setState({ redirectToApp: 'NUL' }); // Set the app to redirect to NulApp
            break;
          case 'CAS':
            this.setState({ redirectToApp: 'CAS' });
            break;
          case 'LIPAM':
            this.setState({ redirectToApp: 'LIPAM' });
            break;
          case 'LP':
            this.setState({ redirectToApp: ' LP' });
            break;
          case 'LEC':
            this.setState({ redirectToApp: 'LEC' });
            break;
          case 'IDM':
            this.setState({ redirectToApp: 'IDM' });
            break;
          case 'LAC':
            this.setState({ redirectToApp: 'LAC' });
            break;
          case 'MOET':
            this.setState({ redirectToApp: 'MOET' });
            break;
          default:
            break;
        }
      } else {
        const error = await response.json();
        window.alert('Error logging in:', error.error);
        this.setState({ error: error.error, isLoading: false }); // Show error and hide progress bar
      }
    } catch (error) {
      window.alert('Error connecting to server:', error);
      // Add your error handling logic here
    }
  };    

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  renderLoginForm() {
    const { selectedNode, password, showPassword, workerNodes } = this.state;
  
    return (
      <div>
        <div className="App-header h2">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="node-select">Institute/MOET:</label>
              <select
                id="node-select"
                value={selectedNode}
                onChange={(e) => this.handleNodeSelect(e.target.value)}
              >
                <option value="">  </option>
                {workerNodes.map((node) => (
                  <option key={node} value={node}>
                    {node}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="password-input">Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password-input"
                value={password}
                onChange={this.handlePasswordChange}
                required
              />
              <button type="button" onClick={this.toggleShowPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
  
            <div className="form-group">
              <button type="submit" className="enlarged-button">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }  
  
  render() {
    const { loginClicked, isLoading, redirectToApp } = this.state;

    
    if (redirectToApp === 'NUL') {
      return <NulApp />;
    } else if (redirectToApp === 'CAS') {
      return <CasApp />;
    } else if (redirectToApp === 'LIPAM') {
      return <LipamApp />;
    } else if (redirectToApp === 'LP') {
      return <LpApp />;
    } else if (redirectToApp === 'LEC') {
      return <LecApp />;
    } else if (redirectToApp === 'IDM') {
      return <IdmApp />;
    } else if (redirectToApp === 'LAC') {
      return <LacApp />;
    } else if (redirectToApp === 'MOET') {
      return <MoetApp />;
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Lesotho Public HLIs DDBM System</h2>
        {!loginClicked && !isLoading && (
          <button onClick={this.handleLoginClick} style={{fontSize: '16px',padding: '10px 10px'}}>
          Login
        </button>
        )}
        {isLoading && <div>Loading...</div>} {/* Show progress bar */}
        {loginClicked && !isLoading && this.renderLoginForm()}
      </div>
      </div>
    );
  }
}

export default App;