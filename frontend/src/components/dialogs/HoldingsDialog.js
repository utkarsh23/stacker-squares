import React, { Component } from 'react';
import dialogPolyfill from 'dialog-polyfill';
import { userSession } from '../../stacks/auth';
import { uintCV, cvToJSON, callReadOnlyFunction } from "@stacks/transactions";
import { StacksMainnet, StacksMocknet } from "@stacks/network";
import { ipfsMapping } from "../../ipfsMapping";

class HoldingsDialog extends Component {
  state = {
    images: [],
  }

  componentDidMount() {
    const holdingsDialog = document.getElementById('holdings-dialog');
    const holdingsButton = document.getElementById('holdings-dialog-btn');
    if (!holdingsDialog.showModal) {
      dialogPolyfill.registerDialog(holdingsDialog);
    }
    holdingsButton.addEventListener('click', function () {
      holdingsDialog.showModal();
      document.querySelector("html").style.overflow = "hidden";
      holdingsDialog.scrollTop = 0;
    });
    holdingsDialog.querySelector('.close').addEventListener('click', function () {
      holdingsDialog.close();
      document.querySelector("html").style.overflow = "initial";
    });
    userSession.loadUserData()
    let holder = userSession.loadUserData().profile.stxAddress.testnet;
    if (process.env.REACT_APP_ENV === "production") {
      holder = userSession.loadUserData().profile.stxAddress.mainnet;
    }
    const URL = (process.env.REACT_APP_STACKS_BASE_URL +
      `/extended/v1/tokens/nft/holdings?principal=` + holder);
    fetch(URL, { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        const contractName = `${process.env.REACT_APP_CONTRACT_ADDRESS}.stacker-squares`;
        for (var i = 0; i < data.results.length; i++) {
          const assetIdentifier = data.results[i]['asset_identifier'].split("::")[0];
          if (assetIdentifier === contractName) {
            const nftNumber = parseInt(data.results[i]["value"]["repr"].substring(1));
            this.fetchNFT(nftNumber);
          }
        }
      });
  }

  fetchNFT = async (nftNum) => {
    const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    let network = new StacksMocknet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    if (process.env.REACT_APP_ENV === "production") {
      network = new StacksMainnet({ url: process.env.REACT_APP_STACKS_BASE_URL });
    }
    const tokenUriCall = await callReadOnlyFunction({
      contractAddress,
      contractName: "stacker-squares",
      functionName: "get-token-uri",
      functionArgs: [uintCV(nftNum)],
      senderAddress: contractAddress,
      network: network,
    });
    const json = cvToJSON(tokenUriCall);
    const hash = json['value']['value']['value'].split("/ipfs/")[1];
    this.setState({ images: this.state.images.concat(ipfsMapping[hash]) });
  }

  showDownload = (_) => {
    const nodeList = document.querySelectorAll('.download-tint');
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].style.display = 'flex';
    }
  }

  hideDownload = (_) => {
    const nodeList = document.querySelectorAll('.download-tint');
    for (let i = 0; i < nodeList.length; i++) {
      nodeList[i].style.display = 'none';
    }
  }

  render() {
    return (
      <dialog className="mdl-dialog" id="holdings-dialog">
        <h4 className="mdl-dialog__title">NFTs That Belong To You</h4>
        <div className="mdl-dialog__content">
          <div className="mdl-grid">
            { this.state.images.length > 0 ? (
                this.state.images.map((img_name, i) => (
                  <div
                    className="mdl-cell mdl-cell--3-col mdl-cell--2-col-phone download-wrapper"
                    key={i}
                    onMouseEnter={this.showDownload} onMouseLeave={this.hideDownload}
                  >
                    <div className="download-tint">
                      <a href={`/collection/${img_name}`} download={`${img_name}`}>
                        <i className="material-icons">file_download</i>
                      </a>
                    </div>
                    <img src={`https://stackersquares.art/collection/${img_name}`} alt="stacker-squares-nft" />
                  </div>
                ))
              ) : <div className="empty-nft-holdings">Currently no NFTs.</div>
            }
          </div>
        </div>
        <div className="mdl-dialog__actions">
          <button type="button" className="mdl-button close">Close</button>
        </div>
      </dialog>
    );
  }
}

export default HoldingsDialog;
