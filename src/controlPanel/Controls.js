import React from 'react';
import Toner from '../_services/toner.js';
import './Controls.css';


export default class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.addBar = this.addBar.bind(this);
        this.removeBar = this.removeBar.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.startTransporter = this.startTransporter.bind(this);
        this.stopTransporter = this.stopTransporter.bind(this);
        this.state = {
            bpm: 120,
            mask: false
        }

        Toner.setBpm(this.state.bpm)
        Toner.setLoopEnd(this.props.bars);
        Toner.clearAll();
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

    clearAll() {
        Toner.clearAll();
    }

    startTransporter() {
        Toner.start();
        this.setState({ mask: true });
    }

    stopTransporter() {
        Toner.stop();
        this.setState({ mask: false });
    }

    render() {
        return (
            <div className="controls">
                <button onClick={this.startTransporter}>start</button>
                <button onClick={this.stopTransporter}>stop</button>
                <button onClick={this.props.addTrack}>+T</button>
                <button onClick={this.props.removeTrack}>-T</button>
                <button onClick={this.clearAll}>clear steps</button>
                <button onClick={this.addBar} disabled={this.state.mask}>add bar</button>
                <button onClick={this.removeBar} disabled={this.state.mask}>remove bar</button>

                <input
                    disabled={this.state.mask}
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