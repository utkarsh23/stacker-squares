import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { authenticate, userSession } from './stacks/auth';
import { makeStandardSTXPostCondition, uintCV, FungibleConditionCode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";

class App extends Component {
  state = {
    userData: null,
  };

  handleSignOut = (e) => {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }

  handleMint = async (e) => {
    e.preventDefault();
    const address = this.state.userData.profile.stxAddress.testnet;
    const amount = uintCV(20000000);

    const options = {
      stxAddress: address,
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      contractName: "stacker-squares",
      functionName: "claim",
      functionArgs: [],
      postConditions: [
        makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, amount.value),
      ],
      network: new StacksMocknet({ url: "http://localhost:3999" }),
      appDetails: {
        name: "Stacker Squares",
        icon: window.location.origin + "/logo.png",
      },
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };
    await openContractCall(options);
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
          : <div>
              <button onClick={this.handleMint}>Mint</button>
              <button onClick={this.handleSignOut}>&nbsp;Sign Out</button>
            </div>}
          <div>{this.state.userData?.profile.stxAddress.testnet}</div>
        </header>
      </div>
    );
  }
}

export default App;
