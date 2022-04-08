import styled from 'styled-components';
import Toner from '../_services/toner';
import Guide from './Guide.js';
import Track from './Track.js';

let titles = {
    drum: "Drums",
    bass: "Bass",
    chords: "Chords"
}

const WidgetBox = styled.div`
    --track-label-width: 50px;

    &.hidden {
        display: none;
    }
`;

const TitleBar = styled.div`
    margin: 1rem 0rem 0.5rem;
    padding: 5px;
    background-color: var(--off-color-2);
    border-radius: 5px;
`;

export default function Widget(props) {

    function getLiveSounds() {
        return Toner.getInstruments()
            .slice(0, props.tracks)
            .filter(inst => inst.group === props.group);
    }

    function getTracks() {
        return getLiveSounds().map(sound => (
            <Track
                key={sound.id}
                name={sound.name}
                instrumentId={sound.id}
                bars={props.bars}
            />
        ));
    }

    return (
        <WidgetBox
            className={getLiveSounds() < 1 ? "hidden" : ""}>
            <TitleBar>
                {titles[props.group]}
            </TitleBar>
            <Guide bars={props.bars} />
            {getTracks()}
        </WidgetBox>
    );
}
