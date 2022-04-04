import { getByTitle } from '@testing-library/react';
import React from 'react';
import Toner from '../_services/toner';
import Guide from './Guide.js';
import Play from './Play.js';
import Track from './Track.js';
import './Widget.css';

let titles = {
    drum: "Drums",
    bass: "Bass",
    chords: "Chords"
}

let availableInstruments = Toner.getInstruments();

export default class Widget extends React.Component {

    getLiveTracks() {
        return availableInstruments.slice(0, this.props.tracks)
    }


    getTracks() {
        return this.getLiveTracks().map(instrumentId => (
            <Track
                key={instrumentId}
                instrumentId={instrumentId}
                bars={this.props.bars}
            />
        ));
    }

    render() {
        return (
            <div className={`
                widget
                ${this.props.tracks < 1 ? "hidden" : ""}
            `}>
                <div className="titleBar">
                    {titles[this.props.type]}
                </div>
                <Guide bars={this.props.bars} />
                <Play bars={this.props.bars} />
                {this.getTracks()}
            </div>
        );
    }
}