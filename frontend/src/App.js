import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { authenticate, userSession } from './stacks/auth';

class App extends Component {
  state = {
    userData: null,
  };

  handleSignOut = (e) => {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }

  componentDidMount = () => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        window.history.replaceState({}, document.title, '/');
        this.setState({ userData: userData });
      });
    } else if (userSession.isUserSignedIn()) {
      this.setState({ userData: userSession.loadUserData() });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {!userSession.isUserSignedIn()
          ? <button onClick={authenticate}>Sign In</button>
          : <button onClick={this.handleSignOut}>&nbsp;Sign Out</button>}
          <div>{this.state.userData?.profile.stxAddress.mainnet}</div>
        </header>
      </div>
    );
  }
}

export default App;
