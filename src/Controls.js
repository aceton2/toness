import React from 'react';
import Toner from './toner.js';
import './Controls.css';


export default class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.addBar = this.addBar.bind(this);
        this.removeBar = this.removeBar.bind(this);
        this.state = {
            bpm: 80
        }

        // Init
        Toner.setBpm(this.state.bpm)
        Toner.setLoopEnd(this.props.bars);
    }

    handleChange(e) {
        this.setState({ bpm: e.target.value })
        Toner.setBpm(e.target.value)
    }

    addBar() {
        let newBars = this.props.bars + 1;
        if (newBars < 5) {
            this.props.setBars(newBars);
            Toner.setLoopEnd(newBars);
        }
    }

    removeBar() {
        let newBars = this.props.bars - 1;
        if (newBars > 0) {
            this.props.setBars(newBars);
            Toner.setLoopEnd(newBars);
        }
    }

    startTransporter() { Toner.start(); }
    stopTransporter() { Toner.stop(); }

    render() {
        return (
            <div className="controls">
                <button onClick={this.startTransporter}>start</button>
                <button onClick={this.stopTransporter}>stop</button>
                <button onClick={this.removeBar}>remove bar</button>
                <button onClick={this.addBar}>add bar</button>
                <button onClick={Toner.clearAll}>clear all</button>
                <input
                    type="range"
                    min="30"
                    max="300"
                    step="1"
                    value={this.state.bpm}
                    onChange={this.handleChange} />
                {this.state.bpm}
            </div>
        );
    }
}