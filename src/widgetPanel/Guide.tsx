import { Slot } from '../_services/sequencer';
import styled from 'styled-components';

const GuideBox = styled.div`
    display: grid;
    grid-template-columns: repeat(32, 1fr);
    text-align: center;
    font-size: 0.7rem;
    line-height: 1rem;
    margin-left: var(--track-label-width);

    & > div.highlight {
        border-radius: 5px;
        background-color: var(--off-color-2);
        opacity: 0.7;
    }
`

export default function Guide(props: { activeStep: string, slots: Array<Slot> }) {

    function generateGuides() {
        return props.slots.map(slot => {
            return <div
                key={slot.id}
                className={(slot.id === props.activeStep) ? "highlight" : ""}>
                {slotToGuideName(slot.id)}
            </div>
        })
    }

    function slotToGuideName(slot: any) {
        return slot.split(':')[2] === '2' ? '+' : Number(slot.slice(2)[0]) + 1
    }

    return (
        <GuideBox>
            {generateGuides()}
        </GuideBox>
    );
}