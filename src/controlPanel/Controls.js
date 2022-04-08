import React from 'react';
import styled from 'styled-components';
import Toner from '../_services/toner.js';

const ControlBox = styled.div`
    margin-bottom: 1rem;
    position: relative;

    button {
        margin-right: 0.5rem;
    }
`;

export default class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.addBar = this.addBar.bind(this);
        this.removeBar = this.removeBar.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.toggleTransporter = this.toggleTransporter.bind(this);
        this.state = {
            bpm: Toner.getDefaults().bpm
        }
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

    toggleTransporter() {
        Toner.toggle();
        document.activeElement.blur(); // to avoid cross-canceling with spacebar listener
    }

    render() {
        return (
            <ControlBox>
                <button onClick={this.toggleTransporter}>start/stop</button>
                <button onClick={this.props.addTrack}>+T</button>
                <button onClick={this.props.removeTrack}>-T</button>
                <button onClick={this.clearAll}>clear steps</button>
                <button onClick={this.addBar}>add bar</button>
                <button onClick={this.removeBar}>remove bar</button>

                <input
                    type="range"
                    min="33"
                    max="330"
                    step="1"
                    value={this.state.bpm}
                    onChange={this.handleChange} />
                {this.state.bpm}
            </ControlBox>
        );
    }
}