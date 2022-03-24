import React from 'react';
import './Toggle.css';
import Toner from './toner.js';

export default class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { eventId: null };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let newEventId = null;
        (this.state.eventId === null) ?
            newEventId = Toner.scheduleI(this.props.timeId, this.props.instrumentId) :
            Toner.unschedule(this.state.eventId);
        this.setState(() => ({ eventId: newEventId }));
    }

    render() {
        return (
            <div className={`
            stepDiv
            ${(this.state.eventId === null) ? "" : "toggled"} 
            `}
                onClick={this.handleClick}>
            </div>
        );
    }
}
