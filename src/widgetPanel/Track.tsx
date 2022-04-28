import styled from 'styled-components';

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

interface SoundProps {
    name: string;
    children: any
}

export default function Track(props: SoundProps) {
    return (
        <TrackWithLabel>
            <Label>
                {props.name}
            </Label>
            <TrackBars>
                {props.children}
            </TrackBars>
        </TrackWithLabel>
    )
}
