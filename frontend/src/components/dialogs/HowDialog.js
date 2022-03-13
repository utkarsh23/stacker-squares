import React, { Component } from 'react';
import dialogPolyfill from 'dialog-polyfill';

class HowDialog extends Component {
  componentDidMount() {
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
  }

  render() {
    return (
      <dialog className="mdl-dialog" id="how-dialog">
        <h4 className="mdl-dialog__title">How It Works</h4>
        <div className="mdl-dialog__content">
          <p>
            Stacker Squares is built on the <a target="_blank" href="https://www.stacks.co/">Stacks blockchain</a>.
            To mint NFTs, perform the following steps:
            <ol>
              <li>Purchase STX from one of <a target="_blank" href="https://www.stacks.co/explore/get-stx#getstx">these exchanges</a></li>
              <li>Install <a target="_blank" href="https://www.hiro.so/wallet">Hiro Wallet</a> &amp; transfer the STX you purchased to this wallet</li>
              <li>Hit the "Connect &amp; Get Started" button on this page to connect your Hiro STX wallet with Stacker Squares</li>
              <li>Hit the "Mint" button on this page after connecting your wallet to mint NFTs</li>
            </ol>
          </p>
        </div>
        <div className="mdl-dialog__actions">
          <button type="button" className="mdl-button close">Close</button>
        </div>
      </dialog>
    );
  }
}

export default HowDialog;
