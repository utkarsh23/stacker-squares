import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { authenticate, userSession } from './stacks/auth';
import { makeStandardSTXPostCondition, uintCV, FungibleConditionCode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
import { tsParticles } from "tsparticles";
import { particlesJson } from "./stackers-particles";

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
    const amount = uintCV(process.env.REACT_APP_NFT_PRICE * 1);

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
    tsParticles.load("stackers-particlesjs", particlesJson);
    const img_wrapper = document.querySelector(".images-wrapper");
    for (var i = 100; i <= 150; i++) {
      const img_element = `<img src="https://stackersquares.art/collection/${i}.png" />`;
      const div_element = `<div class="mdl-cell mdl-cell--2-col">${img_element}</div>`;
      img_wrapper.innerHTML += div_element;
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="stackers-particlesjs"></div>
        </header>
        <div className="mdl-grid landing-header">
          <div className="mdl-cell mdl-cell--12-col">
            <img src={logo} className="landing-logo" alt="logo" />
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            <div className="landing-heading">Stacker&nbsp;Squares</div>
          </div>
          <div className="mdl-cell mdl-cell--12-col">
            {
              !userSession.isUserSignedIn()
                ? <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons">
                  Connect &amp; Get Started
                </button>
                : <div>
                  <button onClick={this.handleMint}>Mint</button>
                  <button onClick={this.handleSignOut}>&nbsp;Disconnect</button>
                  <div>{this.state.userData?.profile.stxAddress.testnet}</div>
                </div>
            }
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
              Mission
            </button>
          </div>
          <div className="mdl-cell mdl-cell--6-col">
            <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
              How It Works
            </button>
          </div>
        </div>
        <div className="main-image-wrapper">
          <div className="mdl-grid images-wrapper"></div>
        </div>
      </div>
    );
  }
}

export default App;
