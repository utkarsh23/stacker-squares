import React, { Component } from 'react';
import dialogPolyfill from 'dialog-polyfill';

class MissionDialog extends Component {
  componentDidMount() {
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
  }

  render() {
    return (
      <dialog className="mdl-dialog" id="mission-dialog">
        <h4 className="mdl-dialog__title">Mission</h4>
        <div className="mdl-dialog__content">
          <p>
            We're here to help aspiring artists turn their dreams into reality.
            Existing NFT platforms are plagued with a ton of issues:
            <ul>
              <li>
                Lack of programmatic NFT generation.
                Artists who are looking to launch collections need some programmatic support
                so they can merge and replicate multiple assets together and
                pick &amp; tune rarity parameters. Some platforms exist that support
                this, but charge exhorbitantly to do so.
              </li>
              <li>
                Lack of awareness. Let's face it, NFTs aren't quite as easy to understand and put off
                even the earliest of adopters. Unless someone completely understands NFTs and
                the implications, they cannot comprehend the possibilities and do not have enough
                of a reason to create and expose their creativity. This is a net
                negative for the world because the world would be better off with
                more creators.
              </li>
              <li>
                UI Customizability. Artists know best how their art should be represented to the world.
                However, most solutions out there are marketplaces with a boring interface where artists
                cannot showcase what makes their art special. Some platforms allow you to customize
                your user interface but this hasn't permeated into the mainstream yet.
              </li>
              <li>
                Unified solution &amp; artist first approach. Some platforms have solved for
                some of the above problems. However, the recurring theme to most of these platforms is that
                they don't support all these things, or they charge even before the artist has
                made any sale. Why can't we make a business model work like payment providers, where you are
                only charged if you make NFT sales?
              </li>
            </ul>
            If you're an aspiring artist, DM us on
            Twitter <a target="_blank" href="https://twitter.com/StackerSquares">@StackerSquares</a> and
            we promise to help you launch your NFT project.
          </p>
        </div>
        <div className="mdl-dialog__actions">
          <button type="button" className="mdl-button close">Close</button>
        </div>
      </dialog>
    );
  }
}

export default MissionDialog;
