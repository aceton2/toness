import styled from 'styled-components'
import Pad from './Pad'
import InstrumentsService from '../../services/core/instruments'
import { SAMPLER_HEIGHT } from '../../constants'

const Sampler = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 2fr);
  grid-gap: 5px;
  width: 100%;
  height: ${SAMPLER_HEIGHT}px;
  position: relative;
`

export default function SamplerPanel() {
  return (
    <Sampler>
      {InstrumentsService.pads.map((pad) => (
        <Pad key={pad.name} pad={pad} />
      ))}
    </Sampler>
  )
}
