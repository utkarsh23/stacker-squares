import React, { Component } from 'react';

const TOTAL_NFT_COUNT = 1200;

class Statistics extends Component {
  state = {
    mintLeft: null,
  };

  componentDidMount() {
    const URL = (process.env.REACT_APP_STACKS_BASE_URL +
      `/v2/contracts/call-read/` +
      process.env.REACT_APP_CONTRACT_ADDRESS +
      `/stacker-squares/get-last-token-id`);
    fetch(
      URL,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: process.env.REACT_APP_SENDER_ADDR,
          arguments: [],
        }),
      })
      .then(res => res.json())
      .then(data => {
        const mintCount = parseInt(data.result.slice(-2), 16);
        this.setState({ mintLeft: TOTAL_NFT_COUNT - mintCount })
      });
  }

  render() {
    return (
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
    );
  }
}

export default Statistics;
