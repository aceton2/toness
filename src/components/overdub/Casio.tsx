import styled from 'styled-components'
import InstrumentsService from "../../services/core/instruments";
import OverdubService from '../../services/sampling/overdub';
import useToneStore from '../../store/store';

function chordPress(note: string) {
    InstrumentsService.casio.triggerAttack(note, 0);
}
function chordRelease(note: string) {
    InstrumentsService.casio.triggerRelease(note)
}

const CasioBox = styled.div`
    background-color: var(--wisteria);
    border-radius: 5px;
`

const KeysBox = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px;
    padding: 5px;
    height: 110px;
`

const Play = styled.button`
    background: var(--off-color-2);
    &:hover {
        background: var(--panel-color-1)
    }`

const ControlsBox = styled.div`
    display: flex;
    justify-content: end;
    button {
        width: 50px;
        margin: 5px;
        background: var(--off-color-2);
        &:hover {
            background: var(--panel-color-1)
        }
    }
`

export default function Casio() {
    const activeTracks = useToneStore(state => state.activeTracks)
    const overdubActive = InstrumentsService.instruments.slice(0, activeTracks).find(i => i.name === "overdub")
    return <div>
    { overdubActive && 
        <CasioBox>
            <KeysBox>
            {["G2", "Bb2", "C3", "Eb3", "F3"].map(note => (
                <Play key={note} 
                    onMouseLeave={() => chordRelease(note)}
                    onMouseDown={() => chordPress(note)} 
                    onMouseUp={() => chordRelease(note)}>
                    {note}
                </Play>
            ))}
            </KeysBox>
            <ControlsBox>
                <button onClick={OverdubService.recordOverdub}>Record</button>
                <button onClick={OverdubService.deleteOverdub}>Delete</button>
            </ControlsBox>
        </CasioBox>
    }
    </div>
}