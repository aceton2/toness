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
  const scheduledEvents = useToneStore(state => state.scheduledEvents)
  const toggleScheduledEvent = useToneStore(state => state.toggleScheduledEvent)
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

  // clean up how we handle emphasis toggle
  function toggleStep(emphasized: boolean, scheduled: string | undefined, stub: string) {
    scheduled ? toggleScheduledEvent(scheduled) : toggleScheduledEvent(`${stub}|${emphasized ? "1" : "0"}`)
  }

  function getToggles(instrumentId: number, timeIds: Array<string>) {
    return timeIds.map((timeId) => {
      const stub = `${timeId}|${instrumentId}`
      const scheduled = scheduledEvents.find(e => e.slice(0, -2) === stub)
      return (
        <Toggle 
          key={stub}
          isActive={activeStep === timeId.split(".")[0]} // the split is because of the triplets
          timeId={timeId}
          instrumentId={instrumentId}
          scheduledEvent={scheduled}
          toggle={(emphasized: boolean) => toggleStep(emphasized, scheduled, stub)}
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
