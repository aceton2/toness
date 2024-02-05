import styled from 'styled-components'
import InstrumentsService from "../../services/core/instruments";
import OverdubService from '../../services/sampling/overdub';
import useToneStore from '../../store/store';

const chords = {
    "CM7": ["C3", "E3", "G3", "B3"],
    "Db7": ["Ab2", "B2", "Db3", "F3"],
}

function chordPress(chord: "CM7" | "Db7") {
    InstrumentsService.casio.triggerAttack(chords[chord], 0);
}
function chordRelease(chord: "CM7" | "Db7") {
    InstrumentsService.casio.triggerRelease(chords[chord])
}

const CasioBox = styled.div`
    display: flex;
    justify-content: end;
    background-color: var(--wisteria);
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
`

const Play = styled.button`
    background: var(--off-color-2);
    &:hover {
        background: var(--panel-color-1)
    }`

const ControlsBox = styled.div`
    button {
        display: block;
        width: 50px;
        margin: 5px;
    }
`

export default function Casio() {
    const activeTracks = useToneStore(state => state.activeTracks)
    const overdubActive = InstrumentsService.instruments.slice(0, activeTracks).find(i => i.name === "overdub")
    return <>
    { overdubActive && <CasioBox>
            <Play onMouseDown={() => chordPress("CM7")} onMouseUp={() => chordRelease("CM7")}>CM7</Play>
            <Play onMouseDown={() => chordPress("Db7")} onMouseUp={() => chordRelease("Db7")}>Db7</Play>
            <ControlsBox>
                <button onClick={OverdubService.recordOverdub}>Record</button>
                <button onClick={OverdubService.deleteOverdub}>Delete</button>
            </ControlsBox>
        </CasioBox>
}
    </>
}