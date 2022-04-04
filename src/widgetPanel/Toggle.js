import React from 'react';
import './Toggle.css';
import Toner from '../_services/toner.js';

export default class Toggle extends React.Component {

    constructor(props) {
        super(props);
        this.state = { eventId: null };
        this.handleClick = this.handleClick.bind(this);
        this.clearEvent = this.clearEvent.bind(this);
    }

    componentDidMount() {
        Toner.getTransport().on('cleared', this.clearEvent);
    }

    componentWillUnmount() {
        if (this.state.eventId) { Toner.unschedule(this.state.eventId); }
        Toner.getTransport().off('cleared', this.clearEvent);
    }

    clearEvent() {
        this.setState({ eventId: null })
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
            <div className="stepDiv">
                <div className={(this.state.eventId === null) ? "free" : "toggled"}
                    onClick={this.handleClick}>
                </div>
            </div>
        );
    }
}
