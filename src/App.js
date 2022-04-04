import React from 'react';
import './App.css';
import Controls from './controlPanel/Controls.js';
import Widget from './widgetPanel/Widget.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      bars: 2,
      tracks: 1
    }

    this.setBars = this.setBars.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  setBars(bars) {
    this.setState({
      bars: bars
    }

    );
  }

  addTrack() {
    if (this.state.tracks < 3) {
      this.setState(prevState => ({
        tracks: prevState.tracks + 1
      }

      ));
    }
  }

  removeTrack() {
    if (this.state.tracks > 1) {
      this.setState(prevState => ({
        tracks: prevState.tracks - 1
      }

      ));
    }
  }

  render() {
    return (
      <div>
        <div className="blockingMask"> <div>please use this app with a wider screen 👺 </div> </div>
        <div className="header"> Simple Sequencer for the Kids </div> <div className="App">
          <Controls
            addInstrument={this.addInstrument}
            setBars={this.setBars}
            bars={this.state.bars}
            addTrack={this.addTrack}
            removeTrack={this.removeTrack}
          />
          <Widget
            bars={this.state.bars}
            tracks={this.state.tracks}
          />
        </div>
      </div>);
  }
}