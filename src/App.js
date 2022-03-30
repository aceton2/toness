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
    this.reset = this.reset.bind(this);
    this.addTrack = this.addTrack.bind(this);
  }

  setBars(bars) {
    this.setState({ bars: bars });
  }

  reset() {
    this.setState({ bars: 1, tracks: 1 });
  }

  addTrack() {
    this.setState(prevState => ({ tracks: prevState.tracks + 1 }));
  }

  render() {
    return (
      <div className="App">
        <Controls
          addInstrument={this.addInstrument}
          setBars={this.setBars}
          reset={this.reset}
          bars={this.state.bars}
          addTrack={this.addTrack}
        />
        <Widget
          bars={this.state.bars}
          tracks={this.state.tracks}
        />
      </div>
    );
  }
}