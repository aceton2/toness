import React from 'react';
import './App.css';
import Track from './Track.js';
import Controls from './Controls.js';
import Grid from './Grid.js';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bars: 2
    }
    this.setBars = this.setBars.bind(this);
  }

  setBars(bars) {
    this.setState({ bars: bars })
  }

  render() {
    return (
      <div className="App">
        <Controls setBars={this.setBars} bars={this.state.bars} />
        <Track instrumentId="1" bars={this.state.bars} />
        <Track instrumentId="2" bars={this.state.bars} />
        <div>-</div>
        <Grid />
      </div>);
  }
}
