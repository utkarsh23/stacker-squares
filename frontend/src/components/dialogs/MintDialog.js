import React, { Component } from 'react';
import dialogPolyfill from 'dialog-polyfill';
import { userSession } from '../../stacks/auth';

class MintDialog extends Component {
  componentDidMount() {
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
  }

  render() {
    return (
      <dialog className="mdl-dialog" id="mint-dialog">
        <h4 className="mdl-dialog__title">Mint NFTs</h4>
        <div className="mdl-dialog__content">
          <p>
            You can either mint a single NFT or you can batch mint 3 or 5 NFTs.
          </p>
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--12-col">
              <button onClick={(e) => this.props.handleMint(e, 'claim', 1)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Mint One
              </button>
            </div>
            <div className="mdl-cell mdl-cell--12-col">
              <button onClick={(e) => this.props.handleMint(e, 'claim-3', 3)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Mint Three
              </button>
            </div>
            <div className="mdl-cell mdl-cell--12-col">
              <button onClick={(e) => this.props.handleMint(e, 'claim-5', 5)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Mint Five
              </button>
            </div>
          </div>
        </div>
        <div className="mdl-dialog__actions">
          <button type="button" className="mdl-button close">Close</button>
        </div>
      </dialog>
    );
  }
}

export default MintDialog;
