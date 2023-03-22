import styled from 'styled-components'
import Pad from './Pad'
import TonerService from "../_services/toner";

const Sampler = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 2fr);
    margin-bottom: 1rem;
    width: 100%;
`

export default function SamplerPanel() {
    return (
    <Sampler>
        { TonerService.getPadNames().map(name => (<Pad key={name} iam={name}/>)) }
    </Sampler>
    )
}