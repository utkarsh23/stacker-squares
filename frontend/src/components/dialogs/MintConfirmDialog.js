import React, { Component } from 'react';
import dialogPolyfill from 'dialog-polyfill';

class MintConfirmDialog extends Component {
  componentDidMount() {
    const mintConfDialog = document.getElementById('mint-confirm-dialog');
    if (!mintConfDialog.showModal) {
      dialogPolyfill.registerDialog(mintConfDialog);
    }
    mintConfDialog.querySelector('.close').addEventListener('click', function () {
      mintConfDialog.close();
      document.querySelector("html").style.overflow = "initial";
    });
  }

  render() {
    return (
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
    );
  }
}

export default MintConfirmDialog;
