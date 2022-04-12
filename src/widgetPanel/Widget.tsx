import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Toner, { SequenceEmitter, SoundCfg } from '../_services/toner';
import { Slot } from '../_services/sequencer';
import Guide from './Guide';
import Track from './Track';

const titles: { [key: string]: string } = {
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

export default function Widget(props: { group: string, tracks: number, slots: Array<Slot> }) {

    const [activeStep, setActiveStep] = useState('');

    useEffect(() => {
        SequenceEmitter.on('step', setStep)
        return () => { SequenceEmitter.off('step', setStep) }
    }, [])

    function setStep(step: string) {
        setActiveStep(step);
    }

    function getLiveSounds(): Array<SoundCfg> {
        return Toner.getInstruments()
            .slice(0, props.tracks)
            .filter(inst => inst.group === props.group);
    }

    function getTracks() {
        return getLiveSounds().map((sound) => (
            <Track
                key={sound.id}
                name={sound.name}
                instrumentId={sound.id}
                slots={props.slots}
                activeStep={activeStep}
            />
        ));
    }

    return (
        <WidgetBox
            className={getLiveSounds().length < 1 ? "hidden" : ""}>
            <TitleBar>
                {titles[props.group]}
            </TitleBar>
            <Guide
                slots={props.slots}
                activeStep={activeStep}
            />
            {getTracks()}
        </WidgetBox>
    );
}
