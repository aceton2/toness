import React from 'react';
import './Toggle.css';
import Toner from '../_services/toner.js';

let colors = {
    odd: "var(--off-color-3)",
    free: "var(--off-color-1)",
    toggled: "var(--off-color-2)"
}

export default class Toggle extends React.Component {

    constructor(props) {
        super(props);
        this.state = { eventId: null };
        this.handleClick = this.handleClick.bind(this);
        this.clearEvent = this.clearEvent.bind(this);
        this.getBackground = this.getBackground.bind(this);
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

    isOdd(id) {
        return id.split(':')[0] % 2 === 1;
    }

    isSecondHalf(id) {
        return id.split(':')[1] > 1;
    }

    getBackground() {
        let color = (this.isOdd(this.props.timeId)) ? colors.odd : colors.free;

        if (this.state.eventId != null) {
            color = colors.toggled;
        }

        return {
            "backgroundColor": color,
        }
    }

    render() {
        return (
            <div className="stepDiv">
                <div style={this.getBackground()}
                    onClick={this.handleClick}>
                </div>
            </div>
        );
    }
}
