import React from 'react';
import './App.css';
import Track from './Track.js';
import Controls from './Controls.js';
import Guide from './Guide.js';
import Play from './Play.js';
import Toner from './toner.js';

let availableInstruments = Toner.getInstruments();

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bars: 2,
      instruments: availableInstruments.slice(0, 1)
    }
    this.setBars = this.setBars.bind(this);
    this.reset = this.reset.bind(this);
    this.addInstrument = this.addInstrument.bind(this);
  }

  setBars(bars) {
    this.setState({ bars: bars });
  }

  reset() {
    this.setBars(0);
    this.setState({
      instruments: availableInstruments.slice(0, 1)
    })
  }

  addInstrument() {
    if (this.state.instruments.length < availableInstruments.length) {
      this.setState(prevState => {
        let currentI = prevState.instruments.slice();
        let newI = availableInstruments[currentI.length];
        currentI.push(newI);
        return {
          instruments: currentI
        }
      })
    }
  }

  getTracks() {
    return this.state.instruments.map(instrumentId =>
      (<Track key={instrumentId} instrumentId={instrumentId} bars={this.state.bars} />)
    );
  }

  getTrackNames() {
    return this.state.instruments.map(instrumentId =>
      (<div key={instrumentId}>{instrumentId}</div>)
    );
  }

  render() {
    return (
      <div className="App">
        <Controls
          addInstrument={this.addInstrument}
          setBars={this.setBars}
          reset={this.reset}
          bars={this.state.bars}
        />

        <div className="widget">

          <div className="instruments">
            <div className="top">&nbsp;</div>
            {this.getTrackNames()}
          </div>

          <div className="beats">
            <Guide bars={this.state.bars} />
            <Play bars={this.state.bars} />
            {this.getTracks()}
          </div>

        </div>

      </div>);
  }
}
