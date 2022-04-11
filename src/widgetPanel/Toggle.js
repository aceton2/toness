import { useState, useEffect } from 'react';
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

export default function Toggle(props) {

    const [eventId, setEventId] = useState(null);
    const [activeStep, setActiveStep] = useState(false);

    useEffect(() => {
        Transport.on('step', lightUp);
        Transport.on('cleared', clearEvent);
        return cleanUp
    }, []);

    function cleanUp() {
        if (eventId) { Toner.unschedule(eventId); }
        Transport.off('cleared', clearEvent);
        Transport.off('step', lightUp);
    }

    function lightUp(step) {
        setActiveStep(step === props.timeId);
    }

    function clearEvent() {
        setEventId(null);
    }

    function handleClick() {
        let newEventId = null;
        (eventId === null) ?
            newEventId = Toner.scheduleI(props.timeId, props.instrumentId) :
            Toner.unschedule(eventId);
        setEventId(newEventId);
    }

    function isOdd(id) {
        return id.split(':')[0] % 2 === 1;
    }

    function getBackground() {
        let color = (isOdd(props.timeId)) ? colors.odd : colors.free;

        if (eventId != null) { color = colors.toggled; }

        return { "backgroundColor": color, }
    }

    return (
        <StepDiv style={{ "opacity": activeStep ? "1" : "0.7" }}>
            <div style={getBackground()}
                onClick={handleClick}>
            </div>
        </StepDiv>
    );
}
