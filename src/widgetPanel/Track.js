import styled from 'styled-components';
import Bar from './Bar';

const Instrument = styled.div`
    display: flex;
    height: 60px;
`;

const Label = styled.div`
    width: var(--track-label-width);
    line-height: 100%;
`;

const TrackBox = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
`;

export default function Track(props) {

    function addBars() {
        return Array(props.bars).fill(null).map((b, i) => (
            <Bar key={i.toString()} barNum={i.toString()} instrumentId={props.instrumentId} />
        ))
    }

    return (
        <Instrument>
            <Label>
                {props.name}
            </Label>
            <TrackBox>
                {addBars()}
            </TrackBox>
        </Instrument>
    )
}
