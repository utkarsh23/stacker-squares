import React, { Component } from 'react';
import { authenticate, userSession } from '../../stacks/auth';
import { makeStandardSTXPostCondition, uintCV, FungibleConditionCode } from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksMainnet, StacksMocknet } from "@stacks/network";
import logo from '../../logo.png';
import MintDialog from '../dialogs/MintDialog';
import HoldingsDialog from '../dialogs/HoldingsDialog';

class Header extends Component {
  state = {
    userData: null,
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        window.history.replaceState({}, document.title, '/');
        this.setState({ userData: userData });
      });
    } else if (userSession.isUserSignedIn()) {
      this.setState({ userData: userSession.loadUserData() });
    }
  }

  handleMint = async (e, funcName, noOfNFTs) => {
    e.preventDefault();
    document.getElementById('mint-dialog').close();
    document.querySelector("html").style.overflow = "initial";
    let address = this.state.userData.profile.stxAddress.testnet;
    if (process.env.REACT_APP_ENV === "production") {
      address = this.state.userData.profile.stxAddress.mainnet;
    }
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
      onFinish: (_) => {
        document.querySelector("html").style.overflow = "hidden";
        document.getElementById('mint-confirm-dialog').showModal();
        document.getElementById('mint-confirm-dialog').scrollTop = 0;
      },
    };
    await openContractCall(options);
  }

  handleSignOut = (e) => {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }

  render() {
    let address = this.state.userData?.profile.stxAddress.testnet;
    if (process.env.REACT_APP_ENV === "production") {
      address = this.state.userData?.profile.stxAddress.mainnet;
    }
    return (
      <>
        <img src={logo} className="landing-logo" alt="logo" />
        <div className="landing-heading">Stacker&nbsp;Squares</div>
        {
          !userSession.isUserSignedIn()
            ? <button onClick={authenticate} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons">
              Connect &amp; Get Started
            </button>
            : <div className="mdl-grid connected-wrapper">
              <div className="wallet-wrapper">Connected Wallet<br />{address}<hr /></div>
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
        {
            userSession.isUserSignedIn() && (
              <div className="mdl-grid holding-wrapper">
                <div className="mdl-cell mdl-cell--12-col info-btn-full">
                  <button id="holdings-dialog-btn" className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored landing-buttons-2">
                    View Your NFTs
                  </button>
                </div>
                <HoldingsDialog />
              </div>
            )
          }
        <MintDialog handleMint={this.handleMint} />
      </>
    );
  }
}

export default Header;
