import React from 'react';
import Toner from '../_services/toner';
import Guide from './Guide.js';
import Track from './Track.js';
import './Widget.css';

let titles = {
    drum: "Drums",
    bass: "Bass",
    chords: "Chords"
}

export default class Widget extends React.Component {

    getLiveTracks() {
        return Toner.getInstruments()
            .slice(0, this.props.tracks)
            .filter(inst => inst.group === this.props.group);
    }

    getTracks() {
        return this.getLiveTracks().map(instrument => (
            <Track
                key={instrument.id}
                name={instrument.name}
                instrumentId={instrument.id}
                bars={this.props.bars}
            />
        ));
    }

    render() {
        return (
            <div className={`
                widget
                ${this.getLiveTracks() < 1 ? "hidden" : ""}
            `}>
                <div className="titleBar">
                    {titles[this.props.group]}
                </div>
                <Guide bars={this.props.bars} />
                {this.getTracks()}
            </div>
        );
    }
}