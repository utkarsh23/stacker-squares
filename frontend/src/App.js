import React, { Component } from 'react';
import './App.css';
import { tsParticles } from "tsparticles";
import { particlesJson } from "./stackers-particles";
import MissionDialog from './components/dialogs/MissionDialog';
import HowDialog from './components/dialogs/HowDialog';
import MintConfirmDialog from './components/dialogs/MintConfirmDialog';
import Header from './components/header/header';
import InfiniteImageLoader from './components/main/InfiniteImageLoader';
import Statistics from './components/header/statistics';

class App extends Component {
  componentDidMount = () => {
    tsParticles.load("stackers-particlesjs", particlesJson);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="stackers-particlesjs"></div>
        </header>
        <div className="mdl-grid landing-header">
          <div className="mdl-cell mdl-cell--4-col">
            <Header />
          </div>
          <div className="mdl-cell mdl-cell--3-col"></div>
          <div className="mdl-cell mdl-cell--5-col">
            <Statistics />
          </div>
        </div>
        <InfiniteImageLoader />
        <MintConfirmDialog handleMint={this.handleMint} />
        <MissionDialog />
        <HowDialog />
      </div>
    );
  }
}

export default App;
