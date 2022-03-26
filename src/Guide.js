import React from 'react';
import './Guide.css';

function generateGuides(barNum, resolutionPerBar = 8) {
    return Array(barNum * resolutionPerBar).fill(null).map((e, index) => {
        return <div key={index} className={`
            ${(index % resolutionPerBar === 0) ? "downbeat" : ""}
            ${(index % resolutionPerBar === resolutionPerBar / 2) ? "backbeat" : ""}
            `
        }
        >
            {(index % 2 === 1) ? '+' : (index % resolutionPerBar) / 2 + 1}
        </div>
    }

    )
}


export default class Guide extends React.Component {
    render() {
        return (<div className="guide"> {
            generateGuides(this.props.bars)
        }

        </div>);
    }
}