import Toggle from './Toggle';
import styled from 'styled-components';

/* define the number of grid columns - fixed to 8 for now */
const BarBox = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
`;

const sixteenths = {
    "8n": ["0", "2"],
    "16n": ["0", "1", "2", "3"]
}

function generateGrid(instrumentId, barNum) {
    return generateSlots(barNum).map((slot, i) => {
        return <Toggle
            key={i.toString()}
            timeId={slot}
            instrumentId={instrumentId}
        />
    })
}

function generateSlots(barNum, resolution = "8n") {
    const slots = [];
    ["0", "1", "2", "3"].forEach(quarterNum => {
        sixteenths[resolution].forEach(sixNum => slots.push(`${barNum}:${quarterNum}:${sixNum}`))
    })
    return slots
}

export default function Bar(props) {
    return (
        <BarBox>
            {generateGrid(props.instrumentId, props.barNum)}
        </BarBox>
    );
}
