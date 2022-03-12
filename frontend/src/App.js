import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { authenticate, userSession } from './stacks/auth';
import { makeStandardSTXPostCondition, uintCV, FungibleConditionCode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMainnet, StacksMocknet } from "@stacks/network";
import { tsParticles } from "tsparticles";
import { particlesJson } from "./stackers-particles";

const PAGINATION_COUNT = 15;
const TOTAL_NFT_COUNT = 1200;

class App extends Component {
  state = {
    userData: null,
    items: 0,
    scrollLock: false,
    mintLeft: null,
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
    let network = new StacksMocknet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    if (process.env.REACT_APP_ENV === "production") {
      network = new StacksMainnet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    }

    const options = {
      stxAddress: address,
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      contractName: "stacker-squares",
      functionName: "claim",
      functionArgs: [],
      postConditions: [
        makeStandardSTXPostCondition(address, FungibleConditionCode.Equal, amount.value),
      ],
      network,
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
    this.addNFTElements();
    window.onscroll = () => {
      const htmlelem = document.querySelector('html');
      if (!this.state.scrollLock && ((htmlelem.scrollHeight - htmlelem.scrollTop) < 1500)) {
        this.setState({ scrollLock: true });
        this.addNFTElements();
        this.setState({ scrollLock: false });
      };
    };
    fetch(
      `${process.env.REACT_APP_STACKS_BASE_URL}/v2/contracts/call-read/${process.env.REACT_APP_CONTRACT_ADDRESS}/stacker-squares/get-last-token-id`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender: process.env.REACT_APP_SENDER_ADDR, arguments: [] }),
      },
    )
      .then(res => res.json())
      .then(data => { this.setState({ mintLeft: 1200 - parseInt(data.result.slice(-2), 16) }) });
  }

  addNFTElements() {
    if (this.state.items >= TOTAL_NFT_COUNT) {
      return;
    }
    const img_wrapper = document.querySelector(".images-wrapper");
    for (var i = 0; i < PAGINATION_COUNT; i++) {
      const img_element = `<img src="https://stackersquares.art/collection/${i + this.state.items + 1}.png" />`;
      const div_element = `<div class="mdl-cell mdl-cell--2-col">${img_element}</div>`;
      img_wrapper.innerHTML += div_element;
    }
    this.setState({ items: this.state.items + PAGINATION_COUNT });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="stackers-particlesjs"></div>
        </header>
        <div className="mdl-grid landing-header">
          <div className="mdl-cell mdl-cell--4-col">
            <img src={logo} className="landing-logo" alt="logo" />
            <div className="landing-heading">Stacker&nbsp;Squares</div>
            {
              !userSession.isUserSignedIn()
                ? <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons">
                  Connect &amp; Get Started
                </button>
                : <div className="mdl-grid connected-wrapper">
                  <div className="wallet-wrapper">Connected Wallet<br />{this.state.userData?.profile.stxAddress.testnet}<hr /></div>
                  <div className="mdl-cell mdl-cell--6-col info-btn-1">
                    <button onClick={this.handleMint} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                      Mint
                    </button>
                  </div>
                  <div className="mdl-cell mdl-cell--6-col info-btn-2">
                    <button onClick={this.handleSignOut} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                      Disconnect
                    </button>
                  </div>
                </div>
            }
            <div className="mdl-grid info-wrapper">
              <div className="mdl-cell mdl-cell--6-col info-btn-1">
                <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                  Mission
                </button>
              </div>
              <div className="mdl-cell mdl-cell--6-col info-btn-2">
                <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                  How It Works
                </button>
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--3-col"></div>
          <div className="mdl-cell mdl-cell--5-col">
            <div className="stats-container">
              <div className="stats-heading">Information Board</div>
              <hr />
              <div className="mdl-grid">
                <div className="mdl-cell mdl-cell--12-col">
                  <div className="stats-label">Price Per NFT</div>
                  <div className="stats-value">20 STX</div>
                </div>
                <div className="mdl-cell mdl-cell--12-col stat-wrapper">
                  <div className="stats-label">NFTs Left to Mint</div>
                  <div className="stats-value">
                    {this.state.mintLeft ? `${this.state.mintLeft} / 1200` : <div className="mdl-spinner mdl-js-spinner is-active"></div>}
                  </div>
                </div>
                <div className="mdl-cell mdl-cell--12-col stat-wrapper">
                  <div className="stats-label">Follow Us on Twitter</div>
                  <div className="stats-value">
                    <a rel="noreferrer" target="_blank" href="https://twitter.com/StackerSquares">@StackerSquares</a>
                    <span className='material-icons open-in-new-icon'>open_in_new</span>
                  </div>
                </div>
              </div>
            </div>
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
