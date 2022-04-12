import styled from 'styled-components';
import Toggle from './Toggle';
import { Slot } from '../_services/sequencer';

const TrackWithLabel = styled.div`
    display: flex;
    height: 60px;
`;

const Label = styled.div`
    width: var(--track-label-width);
    line-height: 100%;
`;

const TrackBars = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
`;

const Bar = styled.div`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
`;

interface TrackProps {
    name: string;
    slots: Array<Slot>;
    instrumentId: number;
    activeStep: string;
}

export default function Track(props: TrackProps) {

    function addBars() {
        const bars = Array.from(new Set(props.slots.map(i => i.bar)));
        return bars.map(bar => (
            <Bar key={bar.toString()}>
                {getToggles(bar)}
            </Bar>
        ))
    }

    function getToggles(bar: number) {
        return props.slots.filter(slot => slot.bar === bar).map((slot, index) => (
            <Toggle
                key={bar + index.toString()}
                timeId={slot.id}
                instrumentId={props.instrumentId}
                isActive={props.activeStep === slot.id}
            />
        ))
    }

    return (
        <TrackWithLabel>
            <Label>
                {props.name}
            </Label>
            <TrackBars>
                {addBars()}
            </TrackBars>
        </TrackWithLabel>
    )
}
