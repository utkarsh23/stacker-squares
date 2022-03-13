import React, { Component } from 'react';

const PAGINATION_COUNT = 15;
const TOTAL_NFT_COUNT = 1200;

class InfiniteImageLoader extends Component {
  state = {
    items: 0,
    scrollLock: false,
  }

  componentDidMount() {
    this.addNFTElements();
    window.onscroll = () => {
      const htmlelem = document.querySelector('html');
      if (!this.state.scrollLock && ((htmlelem.scrollHeight - htmlelem.scrollTop) < 3000)) {
        this.setState({ scrollLock: true });
        this.addNFTElements();
        this.setState({ scrollLock: false });
      };
    };
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
      <div className="main-image-wrapper">
        <div className="mdl-grid images-wrapper"></div>
      </div>
    );
  }
}

export default InfiniteImageLoader;
