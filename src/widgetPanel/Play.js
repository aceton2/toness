import React from 'react';
import './Play.css';
import { Transport } from 'tone';

export default class Play extends React.Component {

    constructor(props) {
        super(props);
        this.state = { duration: "0s", playing: false };
    }

    componentDidMount() {
        Transport.on('start', () => this.triggerAnimation());
        Transport.on('stop', () => this.stopAnimation());
    }

    triggerAnimation() {
        let beatsPerSecond = Transport.bpm.value / 60;
        let duration = (1 / beatsPerSecond) * (this.props.bars * 4);
        this.setState({ playing: true, duration: `${duration}s` });
    }

    stopAnimation() {
        this.setState({ playing: false });
    }

    getMeter() {
        if (this.state.playing) return (<div
            className={`
            meter
            bars${this.props.bars}`}
            style={{ animationDuration: this.state.duration }}
        ></div>);
    }

    render() {
        return (
            <div className="container">
                <div className="player">
                    {this.getMeter()}
                </div>
            </div>);
    }
}