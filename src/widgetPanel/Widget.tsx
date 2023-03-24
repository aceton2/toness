import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import TonerService from '../_services/toner'
import SequencerService from '../_services/sequencer'
import { Slot } from '../_services/interfaces'
import Guide from './Guide'
import Toggle from './Toggle'
import Track from './Track'
import useToneStore, { selectIsFullGrid } from '../_store/store'


const WidgetBox = styled.div`
  --track-label-width: 50px;

  &.hidden {
    display: none;
  }
`

const Bar = styled.div<{ doubled: boolean }>`
  display: grid;
  grid-template-columns: repeat(${props => props.doubled ? 16 : 8}, 1fr);
`
/**
 * This widget represents a instrument group
 */
export default function Widget() {
  const [activeStep, setActiveStep] = useState('')
  const slots = useToneStore(state => state.activeSlots)
  const tracks = useToneStore(state => state.activeTracks)
  const doubledGrid = useToneStore(selectIsFullGrid)
  const scheduledEvents = useToneStore(state => state.scheduledEvents)
  const toggleScheduledEvent = useToneStore(state => state.toggleScheduledEvent)

  useEffect(() => {
    SequencerService.sequenceEmitter.on('step', setStep)
    return () => {
      SequencerService.sequenceEmitter.off('step', setStep)
    }
  }, [])

  const setStep = useCallback((step: string) => setActiveStep(step), [])

  // COMPONENTS

  function getTracks() {
    return TonerService.getInstruments()
      .slice(0, tracks)
      .map((sound) => (
      <Track key={sound.id} name={sound.name}>
        {getBars(sound.id)}
      </Track>
    ))
  }

  function getBars(soundId: number) {
    const bars = Array.from(new Set(slots.map(slot => slot.bar)))
    return bars.map((bar: number) => (
      <Bar doubled={doubledGrid} key={bar}>
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
          isActive={activeStep === slot.timeId}
          scheduledEvent={scheduledEvent}
          scheduled={isScheduled(scheduledEvent)}
          toggle={() => toggleScheduledEvent(scheduledEvent)}
        />
      )
    })
  }

  function isScheduled(scheduledEvent: string) {
    return scheduledEvents.indexOf(scheduledEvent) !== -1
  }

  // RENDER

  return (
    <WidgetBox>
      <Guide slots={slots} activeStep={activeStep} />
      {getTracks()}
    </WidgetBox>
  )
}
