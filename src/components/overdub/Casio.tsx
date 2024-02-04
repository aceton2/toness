import styled from 'styled-components'
import InstrumentsService from "../../services/core/instruments";
import OverdubService from '../../services/sampling/overdub';

const chord = ["C3", "E3", "G3", "B3"]
function chordPress() {
    InstrumentsService.casio.triggerAttack(chord, 0);
}
function chordRelease() {
    InstrumentsService.casio.triggerRelease(chord)
}

const CasioBox = styled.div`
    margin-top: 10px;
`

export default function Casio() {
    return <CasioBox>
            <button onMouseDown={chordPress} onMouseUp={chordRelease}>Play</button>
            <button onClick={OverdubService.recordOverdub}>Record</button>
            <button onClick={OverdubService.deleteOverdub}>Delete</button>
        </CasioBox>
}