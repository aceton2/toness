import React from 'react';
import './Track.css';
import Bar from './Bar';


export default class Track extends React.Component {

    addBars(bars, instrumentId) {
        return Array(bars).fill(null).map((b, i) => (
            <Bar key={i.toString()} barNum={i.toString()} instrumentId={instrumentId} />
        ))
    }

    render() {
        return (
            <div className="track">
                {this.addBars(this.props.bars, this.props.instrumentId)}
            </div>
        )
    }
}