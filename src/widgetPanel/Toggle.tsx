import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Sequencer from '../_services/sequencer';
import { SequenceEmitter } from '../_services/toner';

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

interface ToggleProps {
    isActive: boolean,
    timeId: string,
    instrumentId: number
}

export default function Toggle(props: ToggleProps) {

    const [eventId, _setEventId] = useState<null | number>(null);
    const eventIdRef = useRef(eventId);

    const setEventId = (val: null | number) => {
        _setEventId(val);
        eventIdRef.current = val;
    }

    useEffect(() => {
        SequenceEmitter.on('cleared', clearEvent);
        return cleanUp
    }, []);

    function cleanUp() {
        if (eventIdRef.current) { Sequencer.unschedule(eventIdRef.current); }
        SequenceEmitter.off('cleared', clearEvent);
    }

    function clearEvent() {
        setEventId(null);
    }

    function handleClick() {
        let newEventId = null;
        (eventId === null) ?
            newEventId = Sequencer.schedule(props.timeId, props.instrumentId) :
            Sequencer.unschedule(eventId);
        setEventId(newEventId);
    }

    function isOdd() {
        return Number(props.timeId.split(':')[0]) % 2 === 1;
    }

    function getBackgroundColor() {
        return (eventId != null) ? colors.toggled :
            isOdd() ? colors.odd : colors.free;
    }

    return (
        <StepDiv style={{ "opacity": props.isActive ? "1" : "0.7" }}>
            <div style={{ "backgroundColor": getBackgroundColor() }}
                onClick={handleClick}>
            </div>
        </StepDiv>
    );
}
