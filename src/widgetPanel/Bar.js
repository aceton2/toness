import React from 'react';
import Toggle from './Toggle';
import './Bar.css';

const sixteenths = {
    "8n": ["0", "2"],
    "16n": ["0", "1", "2", "3"]
}

function generateGrid(instrumentId, barNum) {
    return generateSlots(barNum).map((slot, i) => {
        return <Toggle key={i.toString()} timeId={slot} instrumentId={instrumentId} oddBar={barNum % 2 === 1} />
    })
}

function generateSlots(barNum, resolution = "8n") {
    const slots = [];
    ["0", "1", "2", "3"].forEach(quarterNum => {
        sixteenths[resolution].forEach(sixNum => slots.push(`${barNum}:${quarterNum}:${sixNum}`))
    })
    return slots
}

export default class Controls extends React.Component {

    render() {
        return (
            <div className="bar">
                {generateGrid(this.props.instrumentId, this.props.barNum)}
            </div>
        )
    }
}
