import React, { Component } from 'react';
import { cvToJSON, callReadOnlyFunction } from "@stacks/transactions";
import { StacksMainnet, StacksMocknet } from "@stacks/network";

const TOTAL_NFT_COUNT = 1200;

class Statistics extends Component {
  state = {
    mintLeft: null,
  };

  componentDidMount() {
    this.fetchLastTokenId();
  }

  fetchLastTokenId = async () => {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    let network = new StacksMocknet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    if (process.env.REACT_APP_ENV === "production") {
      network = new StacksMainnet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    }
    const lastTokenIdCall = await callReadOnlyFunction({
      contractAddress,
      contractName: "stacker-squares",
      functionName: "get-last-token-id",
      functionArgs: [],
      senderAddress: contractAddress,
      network: network,
    });
    const json = cvToJSON(lastTokenIdCall);
    const mintCount = json['value']['value'];
    this.setState({ mintLeft: TOTAL_NFT_COUNT - mintCount })
  };

  render() {
    return (
      <div className="stats-container">
        <div className="stats-heading">Stacker Board</div>
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
              <span className="fa fa-twitter"></span>&nbsp;
              <a rel="noreferrer" target="_blank" href="https://twitter.com/StackerSquares">@StackerSquares</a>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--12-col stat-wrapper">
            <div className="stats-label">Follow us on Instagram</div>
            <div className="stats-value">
              <span className="fa fa-instagram"></span>&nbsp;
              <a rel="noreferrer" target="_blank" href="https://www.instagram.com/stackersquares/">stackersquares</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Statistics;
