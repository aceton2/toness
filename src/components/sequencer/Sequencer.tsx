import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import SequencerService from '../../services/transport/sequencer'
import Toggle from './Toggle'
import Track from './Track'
import useToneStore, { GridResolutions } from '../../store/store'
import InstrumentsService from '../../services/instruments'
import GridService from '../../services/transport/grid'


const SequencerBox = styled.div`
  --track-label-width: 50px;
  margin-top: 1.5rem;

  &.hidden {
    display: none;
  }
`

const resolutionToRepeat = {
'16n': 16,
'8n': 8,
'8t': 12,
} 

const Bar = styled.div<{ gridResolution: GridResolutions }>`
  display: grid;
  grid-template-columns: repeat(${props => resolutionToRepeat[props.gridResolution]}, 1fr);
  border-radius: 2px
`

export default function Sequencer() {
  const [activeStep, setActiveStep] = useState('')
  const timeIds = useToneStore(state => state.activeTimeIds)
  const tracks = useToneStore(state => state.activeTracks)
  const gridResolution = useToneStore(state => state.resolution)
  const trackSounds = InstrumentsService.instruments.slice(0, tracks)

  useEffect(() => {
    SequencerService.stepEmitter.on('step', setStep)
    return () => {
      SequencerService.stepEmitter.off('step', setStep)
    }
  }, [])

  const setStep = useCallback((step: string) => setActiveStep(step), [])

  // clean up logic for determing individual bars
  function getBars(soundId: number) {
    const bars = Array.from(new Set(timeIds.map(timeId => GridService.parseTimeId(timeId).bar)))
    return bars.map((bar: number) => (
      <Bar gridResolution={gridResolution} key={bar}>
        {getToggles(
          soundId,
          timeIds.filter((timeId) => GridService.parseTimeId(timeId).bar === bar)
        )}
      </Bar>
    ))
  }

  function getToggles(instrumentId: number, timeIds: Array<string>) {
    return timeIds.map((timeId) => {
      return (
        <Toggle 
          key={`${timeId}|${instrumentId}`}
          // the split to remove decimal sixteenths in triplets
          isActive={activeStep === timeId.split(".")[0]}
          timeId={timeId}
          instrumentId={instrumentId}
        />
      )
    })
  }

  return (
    <SequencerBox>
      {trackSounds.map((instrument) => (
      <Track key={instrument.id} instrument={instrument}>
        {getBars(instrument.id)}
      </Track>))}
    </SequencerBox>
  )
}
