import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Sequencer from '../_services/sequencer';

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

export default function Toggle(props: { isActive: boolean, timeId: string, instrumentId: string }) {

    const [eventId, _setEventId] = useState<null | number>(null);
    const eventIdRef = useRef(eventId);

    const setEventId = (val: null | number) => {
        _setEventId(val);
        eventIdRef.current = val;
    }

    useEffect(() => {
        // @ts-ignore
        Sequencer.transport().on('cleared', clearEvent);
        return cleanUp
    }, []);

    function cleanUp() {
        if (eventIdRef.current) { Sequencer.unschedule(eventIdRef.current); }
        // @ts-ignore
        Sequencer.transport().off('cleared', clearEvent);
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

    function isOdd(id: string) {
        return Number(id.split(':')[0]) % 2 === 1;
    }

    function getBackground() {
        let color = (isOdd(props.timeId)) ? colors.odd : colors.free;

        if (eventId != null) { color = colors.toggled; }

        return { "backgroundColor": color, }
    }

    return (
        <StepDiv style={{ "opacity": props.isActive ? "1" : "0.7" }}>
            <div style={getBackground()}
                onClick={handleClick}>
            </div>
        </StepDiv>
    );
}
