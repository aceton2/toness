import React from 'react';
import './App.css';
import Track from './Track.js';
import Controls from './Controls.js';
import Guide from './Guide.js';
import Play from './Play.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bars: 2
    }
    this.setBars = this.setBars.bind(this);
  }

  setBars(bars) {
    this.setState({ bars: bars });
  }

  reset() {
    this.setBars(0);
  }

  render() {
    return (
      <div className="App">
        <Controls setBars={this.setBars} reset={this.reset} bars={this.state.bars} />
        <Guide bars={this.state.bars} />
        <Play bars={this.state.bars} />
        <Track instrumentId="1" bars={this.state.bars} />
        <Track instrumentId="2" bars={this.state.bars} />
      </div>);
  }
}
