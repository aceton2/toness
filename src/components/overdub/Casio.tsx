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
    margin: 5px;
`

const KeysBox = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 5px;
    height: 113px;
`

const Key = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    border-radius: 5px;
    padding: 5px;
    overflow: hidden;
    text-align: center;
    
`

const Play = styled.div`
    flex-grow: 1;
    background: var(--off-color-2);
    cursor: pointer;
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

const Label = styled.div`
    background: var(--background-mid);
`

const PadGridDiv = styled.div`
    // margin: 10px auto;
    // width: 200px;
`

const notes = [
    {label: "1", low: "C2", high: "C3"},
    {label: "3b", low: "Eb2", high: "Eb3"},
    {label: "4", low: "F2", high: "F3"},
    {label: "5", low: "G2", high: "G3"},
    {label: "7", low: "Bb2", high: "Bb3"},
]

export default function Casio() {
    const activeTracks = useToneStore(state => state.activeTracks)
    const overdubActive = InstrumentsService.instruments.slice(0, activeTracks).find(i => i.name === "overdub")
    return <PadGridDiv>
    { overdubActive && 
        <CasioBox>
            <KeysBox>
            {notes.map(notes => (
                <Key key={notes.low} >
                    <Play 
                    onMouseLeave={() => chordRelease(notes.low)}
                    onMouseDown={() => chordPress(notes.low)} 
                    onMouseUp={() => chordRelease(notes.low)}>
                    {notes.low}
                    </Play>
                    <Play
                        onMouseLeave={() => chordRelease(notes.high)}
                        onMouseDown={() => chordPress(notes.high)} 
                        onMouseUp={() => chordRelease(notes.high)}>
                        {notes.high}
                    </Play>
                    <Label>{notes.label}</Label>
                </Key>
            ))}
            </KeysBox>
            <ControlsBox>
                <button onClick={OverdubService.recordOverdub}>Record</button>
                <button onClick={OverdubService.deleteOverdub}>Delete</button>
            </ControlsBox>
        </CasioBox>
    }
    </PadGridDiv>
}