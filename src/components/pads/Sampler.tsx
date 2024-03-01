import styled from 'styled-components'
import Pad from './Pad'
import InstrumentsService from '../../services/core/instruments'
import Casio from '../overdub/Casio'

const Sampler = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 2fr);
    margin-bottom: 2rem;
    width: 100%;
    position: relative;
`

const Floater = styled.div`
    position: absolute;
    left: -31px;
    top: 0;
    background: var(--off-color-2);
    z-index: 1;
    border-radius: 2px;
    padding: 1px;
`

export default function SamplerPanel() {
    return (
    <Sampler>
        <Floater>SAMPLER</Floater>
        { InstrumentsService.pads.map(pad => (<Pad key={pad.name} pad={pad}/>)) }
    </Sampler>
    )
}