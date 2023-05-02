import styled from 'styled-components'
import Pad from './Pad'
import TonerService from "../_services/toner";

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
        { TonerService.getPadNames().map(name => (<Pad key={name} iam={name}/>)) }
    </Sampler>
    )
}