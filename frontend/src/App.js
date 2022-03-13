import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import { authenticate, userSession } from './stacks/auth';
import { makeStandardSTXPostCondition, uintCV, FungibleConditionCode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMainnet, StacksMocknet } from "@stacks/network";
import { tsParticles } from "tsparticles";
import { particlesJson } from "./stackers-particles";
import dialogPolyfill from 'dialog-polyfill';

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

  handleMint = async (e, funcName, noOfNFTs) => {
    e.preventDefault();
    document.getElementById('mint-dialog').close();
    document.querySelector("html").style.overflow = "initial";
    const address = this.state.userData.profile.stxAddress.testnet;
    const amount = uintCV(process.env.REACT_APP_NFT_PRICE * noOfNFTs);
    let network = new StacksMocknet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    if (process.env.REACT_APP_ENV === "production") {
      network = new StacksMainnet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    }

    const options = {
      stxAddress: address,
      contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
      contractName: "stacker-squares",
      functionName: funcName,
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
        document.querySelector("html").style.overflow = "hidden";
        document.getElementById('mint-confirm-dialog').showModal();
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
    if (userSession.isUserSignedIn()) {
      const mintDialog = document.getElementById('mint-dialog');
      const mintDialogButton = document.getElementById('mint-dialog-btn');
      if (!mintDialog.showModal) {
        dialogPolyfill.registerDialog(mintDialog);
      }
      mintDialogButton.addEventListener('click', function () {
        mintDialog.showModal();
        document.querySelector("html").style.overflow = "hidden";
      });
      mintDialog.querySelector('.close').addEventListener('click', function () {
        mintDialog.close();
        document.querySelector("html").style.overflow = "initial";
      });
    }
    const mintConfDialog = document.getElementById('mint-confirm-dialog');
    if (!mintConfDialog.showModal) {
      dialogPolyfill.registerDialog(mintConfDialog);
    }
    mintConfDialog.querySelector('.close').addEventListener('click', function () {
      mintConfDialog.close();
      document.querySelector("html").style.overflow = "initial";
    });
    const missionDialog = document.getElementById('mission-dialog');
    const missionDialogButton = document.getElementById('mission-dialog-btn');
    if (!missionDialog.showModal) {
      dialogPolyfill.registerDialog(missionDialog);
    }
    missionDialogButton.addEventListener('click', function () {
      missionDialog.showModal();
      document.querySelector("html").style.overflow = "hidden";
    });
    missionDialog.querySelector('.close').addEventListener('click', function () {
      missionDialog.close();
      document.querySelector("html").style.overflow = "initial";
    });
    const howDialog = document.getElementById('how-dialog');
    const howDialogButton = document.getElementById('how-dialog-btn');
    if (!howDialog.showModal) {
      dialogPolyfill.registerDialog(howDialog);
    }
    howDialogButton.addEventListener('click', function () {
      howDialog.showModal();
      document.querySelector("html").style.overflow = "hidden";
    });
    howDialog.querySelector('.close').addEventListener('click', function () {
      howDialog.close();
      document.querySelector("html").style.overflow = "initial";
    });
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
                    <button id="mint-dialog-btn" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
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
                <button id="mission-dialog-btn" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                  Mission
                </button>
              </div>
              <div className="mdl-cell mdl-cell--6-col info-btn-2">
                <button id="how-dialog-btn" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                  How It Works
                </button>
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--3-col"></div>
          <div className="mdl-cell mdl-cell--5-col">
            <div className="stats-container">
              <div className="stats-heading">Statistics</div>
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
                  <div className="stats-label">Follow us on Twitter</div>
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
        <dialog className="mdl-dialog" id="mint-dialog">
          <h4 className="mdl-dialog__title">Mint NFTs</h4>
          <div className="mdl-dialog__content">
            <p>
              You can either mint a single NFT or you can batch mint 3 or 5 NFTs.
            </p>
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--12-col">
                <button onClick={(e) => this.handleMint(e, 'claim', 1)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                  Mint One
                </button>
              </div>
              <div className="mdl-cell mdl-cell--12-col">
                <button onClick={(e) => this.handleMint(e, 'claim-3', 3)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                  Mint Three
                </button>
              </div>
              <div className="mdl-cell mdl-cell--12-col">
                <button onClick={(e) => this.handleMint(e, 'claim-5', 5)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                  Mint Five
                </button>
              </div>
            </div>
          </div>
          <div className="mdl-dialog__actions">
            <button type="button" className="mdl-button close">Close</button>
          </div>
        </dialog>
        <dialog className="mdl-dialog" id="mint-confirm-dialog">
          <h4 className="mdl-dialog__title">Mint Confirmation</h4>
          <div className="mdl-dialog__content">
            <p>
              Your transaction has been submitted. You should see the NFT(s) in your wallet shortly.
            </p>
          </div>
          <div className="mdl-dialog__actions">
            <button type="button" className="mdl-button close">Close</button>
          </div>
        </dialog>
        <dialog className="mdl-dialog" id="mission-dialog">
          <h4 className="mdl-dialog__title">Mission</h4>
          <div className="mdl-dialog__content">
            <p>
              Your transaction has been submitted. You should see the NFT(s) in your wallet shortly.
            </p>
          </div>
          <div className="mdl-dialog__actions">
            <button type="button" className="mdl-button close">Close</button>
          </div>
        </dialog>
        <dialog className="mdl-dialog" id="how-dialog">
          <h4 className="mdl-dialog__title">How It Works</h4>
          <div className="mdl-dialog__content">
            <p>
              Your transaction has been submitted. You should see the NFT(s) in your wallet shortly.
            </p>
          </div>
          <div className="mdl-dialog__actions">
            <button type="button" className="mdl-button close">Close</button>
          </div>
        </dialog>
      </div>
    );
  }
}

export default App;
