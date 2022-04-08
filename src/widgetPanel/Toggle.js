import React from 'react';
import styled from 'styled-components';
import Toner from '../_services/toner.js';

let colors = {
    odd: "var(--off-color-3)",
    free: "var(--off-color-1)",
    toggled: "var(--off-color-2)"
}

const StepDiv = styled.div`
    padding: 2px;
    cursor: pointer;
    
    div {
        height: 100%;
        border-radius: 2px;
    }
`

let Transport = Toner.getTransport();

export default class Toggle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventId: null,
            step: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.clearEvent = this.clearEvent.bind(this);
        this.getBackground = this.getBackground.bind(this);
        this.lightUp = this.lightUp.bind(this);
    }

    componentDidMount() {
        Transport.on('cleared', this.clearEvent);
        Transport.on('step', this.lightUp);
    }

    componentWillUnmount() {
        if (this.state.eventId) { Toner.unschedule(this.state.eventId); }
        Transport.off('cleared', this.clearEvent);
        Transport.off('step', this.lightUp);
    }

    lightUp(time) {
        if (this.state.step === false && time === this.props.timeId) {
            this.setState({ step: true });
        } else if (this.state.step === true && time !== this.props.timeId) {
            this.setState({ step: false });
        } else if (time === "stop") {
            this.setState({ step: false });
        }
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
            <StepDiv style={{ "opacity": this.state.step ? "1" : "0.7" }}>
                <div style={this.getBackground()}
                    onClick={this.handleClick}>
                </div>
            </StepDiv>
        );
    }
}
