import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'
import SequencerService from '../_services/sequencer'
import { Slot } from '../_services/interfaces'
import Toggle from './Toggle'
import Track from './Track'
import useToneStore, { GridResolutions } from '../_store/store'


const WidgetBox = styled.div`
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
`
/**
 * This widget represents a instrument group
 */
export default function Widget() {
  const [activeStep, setActiveStep] = useState('')
  const slots = useToneStore(state => state.activeSlots)
  const tracks = useToneStore(state => state.activeTracks)
  const gridResolution = useToneStore(state => state.resolution)
  const scheduledEvents = useToneStore(state => state.scheduledEvents)
  const toggleScheduledEvent = useToneStore(state => state.toggleScheduledEvent)
  const trackSounds = TonerService.getInstruments().slice(0, tracks)

  useEffect(() => {
    SequencerService.sequenceEmitter.on('step', setStep)
    return () => {
      SequencerService.sequenceEmitter.off('step', setStep)
    }
  }, [])

  const setStep = useCallback((step: string) => setActiveStep(step), [])

  // COMPONENTS

  function getBars(soundId: number) {
    const bars = Array.from(new Set(slots.map(slot => slot.bar)))
    return bars.map((bar: number) => (
      <Bar gridResolution={gridResolution} key={bar}>
        {getToggles(
          soundId,
          slots.filter((slot) => slot.bar === bar)
        )}
      </Bar>
    ))
  }

  function getToggles(instrumentId: number, slots: Array<Slot>) {
    return slots.map((slot) => {
      const scheduledEvent = `${slot.timeId}|${instrumentId}`
      return (
        <Toggle 
          key={scheduledEvent}
          isActive={activeStep === slot.timeId.split(".")[0]}
          scheduledEvent={scheduledEvent}
          scheduled={scheduledEvents.indexOf(scheduledEvent) !== -1}
          toggle={() => toggleScheduledEvent(scheduledEvent)}
        />
      )
    })
  }

  // RENDER

  return (
    <WidgetBox>
      {trackSounds.map((sound) => (
      <Track key={sound.id} name={sound.name}>
        {getBars(sound.id)}
      </Track>))}
    </WidgetBox>
  )
}
