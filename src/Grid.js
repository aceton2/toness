import React from 'react';
import './Grid.css';
import Toggle from './Toggle';

function generateGrid(num) {
    return Array(parseInt(num)).fill(null).map((i, index) => {
        return <Toggle key={index.toString()} id={index} />
    })
}

export default class Grid extends React.Component {
    render() {
        return (
            <div className="grid">
                {generateGrid(this.props.boxes)}
            </div>
        )
    }
}