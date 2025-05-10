import styled from 'styled-components'
import useToneStore, { GridSignature } from '../../store/store'
import InstrumentsService from '../../services/core/instruments'
import { Track } from './Track'

const SequencerBox = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;

  &.hidden {
    display: none;
  }
`

const resolutionPerBeat = {
  '16n': 4,
  '8n': 2,
  '8t': 3,
}

export default function Sequencer() {
  const activeTracks = useToneStore((state) => state.activeTracks)
  const timeIds = useToneStore((state) => state.activeTimeIds)
  const gridResolution = useToneStore((state) => state.resolution)
  const gridSignature = useToneStore((state) => state.signature)
  return (
    <SequencerBox>
      {InstrumentsService.instruments.slice(0, activeTracks).map((instrument) => (
        <Track
          instrument={instrument}
          key={instrument.id}
          togglesPerBeat={resolutionPerBeat[gridResolution] * parseInt(gridSignature)}
          gridSignature={gridSignature}
          timeIds={timeIds}
        />
      ))}
    </SequencerBox>
  )
}
